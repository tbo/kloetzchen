var CANNON = require('cannon');

var baseImpulse = 0.2;
const ITERATIONS_BETWEEN_SLEEP_CHECK = 20;
const SLEEP_VELOCITY = 0.5;
var currentIteration = 0;

var world = new CANNON.World();
world.gravity.set(0,0,-9.82);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;
// world.solver.tolerance = 0.01;

world.defaultContactMaterial.contactEquationStiffness = 1e8;
world.defaultContactMaterial.contactEquationRegularizationTime = 10;
// Static ground plane
// Static bodies only interacts with dynamic bodies. Velocity is always zero.
var groundShape = new CANNON.Plane();
var groundMaterial = new CANNON.Material('groundMaterial');
var groundBody = new CANNON.Body({
    mass: 0,
    material: groundMaterial // mass=0 will produce a static body automatically
});


var slipperyMaterial = new CANNON.Material('slipperyMaterial');

var groundGroundContactMaterial = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
    friction: 1,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRegularizationTime: 3,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3
});

world.addContactMaterial(groundGroundContactMaterial);



var slipperyGroundContactMaterial = new CANNON.ContactMaterial(groundMaterial, slipperyMaterial, {
    friction: 1,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRegularizationTime: 3
});

world.addContactMaterial(slipperyGroundContactMaterial);

var slipperySlipperyContactMaterial = new CANNON.ContactMaterial(slipperyMaterial, slipperyMaterial, {
    friction: 0.0,
    restitution: 0.01,
    contactEquationStiffness: 1e8,
    contactEquationRegularizationTime: 0.3
});

world.addContactMaterial(slipperySlipperyContactMaterial);

groundBody.addShape(groundShape);
world.add(groundBody);
var box = new CANNON.Box(new CANNON.Vec3(1.0, 3.0, 0.5));

function createCube (x, y, z, zRotation) {
    var cube = new CANNON.Body({
        mass: 0.05, // kg
        position: new CANNON.Vec3(x, y, z), // m
        material: slipperyMaterial
    });

    cube.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), zRotation);
    cube.collisionResponse = true;
    cube.allowSleep = true;
    cube.angularDamping = 0;
    cube.linearDamping = 0;
    /*
    cube.sleepSpeedLimit = 0.05;
    cube.sleepTimeLimit = 0.03;
    */



    cube.addShape(box);
    return cube;
}

function bootstrappingObjects(bootstrapping) {
    var bootstrapLength = bootstrapping.length;
    if (bootstrapLength) {
        var body = null,
            obj = null;
        for (var i = 0; i < bootstrapLength; i++) {
            obj = bootstrapping[i];
            switch (obj.type) {
                case 'cube':
                    body = createCube(obj.initialPosition.x, obj.initialPosition.y, obj.initialPosition.z, obj.initialPosition.zRotation);
                    break;
                default:
                    console.warn('Type:', obj.type, 'unknown');
                    continue;
            }
            world.add(body);
            obj.body = body;
        }
    }
}

function removeObjects(tombstoned) {
    var tombstonedLength = tombstoned.length;
    if (tombstonedLength) {
        for (var i = 0; i < tombstonedLength; i++) {
            world.remove(tombstoned[i].body);
        }
    }
}

function movePlayer(player, delta) {
    var velocity = player.body.velocity,
        movement = player.movement,
        relativeImpulse = baseImpulse * delta;
    if (movement.forward) {
        velocity.y = relativeImpulse;
    }
    if (movement.backward) {
        velocity.y = -relativeImpulse ;
    }
    if (movement.up) {
        velocity.z = relativeImpulse ;
    }
    if (movement.right) {
        velocity.x = relativeImpulse ;
    }
    if (movement.left) {
        velocity.x = -relativeImpulse ;
    }
}


function stopWobblingObjects(objects) {
    for(var i = objects.length - 1; i >= 0; --i) {
        var body = objects[i].body;
        if (Math.abs(body.velocity.x) < SLEEP_VELOCITY && Math.abs(body.velocity.y) < SLEEP_VELOCITY && Math.abs(body.velocity.z) < SLEEP_VELOCITY) {
            body.sleep();
        }
    }
}

function checkStopWobblingObjects(objects) {
    currentIteration = (currentIteration + 1) % ITERATIONS_BETWEEN_SLEEP_CHECK;

    if (!currentIteration) {
        stopWobblingObjects(objects);
    }
}

module.exports = function(gameState) {
    bootstrappingObjects(gameState.bootstrapping);
    checkStopWobblingObjects(gameState.objects);
    if (gameState.player.body.wakeUp) {
        gameState.player.body.wakeUp();
    }
    movePlayer(gameState.player, gameState.timing.delta);
    world.step(1.0/60.0, gameState.timing.delta / 1000);
    removeObjects(gameState.tombstoned);
};

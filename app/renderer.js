'use strict';
var THREE = require('./three.min.js');
var lights = require('./lights');
var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();

function addLights() {
    for(var index in lights) {
        scene.add(lights[index]);
    }
}

function getRandomColor() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function createCube() {
    var geometry = new THREE.BoxGeometry(2,6,1);
    var material = new THREE.MeshLambertMaterial({color: getRandomColor(), opacity: 0.1});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

addLights();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
var groundMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505 } );
groundMat.color.setHSL( 0.095, 1, 0.75 );

var ground = new THREE.Mesh( groundGeo, groundMat );
scene.add( ground );

ground.receiveShadow = true;
camera.position.z = 6;
camera.position.y = -10;
renderer.gammaInput = true;
renderer.gammaOutput = true;

renderer.shadowMapEnabled = true;
renderer.shadowMapCullFace = THREE.CullFaceBack;

function bootstrappingObjects(bootstrapping) {
    var bootstrapLength = bootstrapping.length;
    if(bootstrapLength) {
        var mesh = null, obj = null;
        for(var i = 0; i < bootstrapLength; i++) {
            obj = bootstrapping[i];
            switch(obj.type) {
                case 'cube':
                    mesh = createCube();
                    break;
                default:
                    console.warn('Type:', obj.type, 'unknown');
                    continue;
            }
            scene.add(mesh);
            obj.mesh = mesh;
        }
    }
}

function removeObjects(tombstoned) {
    var tombstonedLength = tombstoned.length;
    if(tombstonedLength) {
        for(var i = 0; i < tombstonedLength; i++) {
            scene.remove(tombstoned[i].mesh);
        }
    }
}

function updatePositions(objects) {
    var objectsLength = objects.length;
    for(var i = 0; i < objectsLength; i++) {
        objects[i].mesh.position.x = objects[i].body.position.x;
        objects[i].mesh.position.y = objects[i].body.position.y;
        objects[i].mesh.position.z = objects[i].body.position.z;
        objects[i].mesh.quaternion.x = objects[i].body.quaternion.x;
        objects[i].mesh.quaternion.y = objects[i].body.quaternion.y;
        objects[i].mesh.quaternion.z = objects[i].body.quaternion.z;
        objects[i].mesh.quaternion.w = objects[i].body.quaternion.w;
    }
}

// Function that returns a raycaster to use to find intersecting objects
// in a scene given screen pos and a camera, and a projector
function getRayCasterFromScreenCoord (screenX, screenY, camera) {
    var mouse3D = new THREE.Vector3();
    // Get 3D point form the client x y
    mouse3D.x = (screenX / window.innerWidth) * 2 - 1;
    mouse3D.y = -(screenY / window.innerHeight) * 2 + 1;
    mouse3D.z = 0.5;
    raycaster.setFromCamera( mouse3D, camera );
}


function findNearestIntersectingObject(clientX,clientY,camera,objects) {
    // Get the picking ray from the point
    getRayCasterFromScreenCoord(clientX, clientY, camera);

    // Find the closest intersecting object
    // Now, cast the ray all render objects in the scene to see if they collide. Take the closest one.
    var hits = raycaster.intersectObjects(objects);
    if (hits.length > 0) {
        return hits[0];
    }
    return hits;
}

function mouseInteraction(gameState) {
    var mouse = gameState.controls.mouse;
    var objects = gameState.objects;
    if(mouse.down) {
        var hit = findNearestIntersectingObject(
            mouse.x,
            mouse.y,
            camera,
            objects.map(function (o) {return o.mesh;})
        );
        objects.some(function (o, index) {
            if(o.mesh === hit.object) {
                gameState.assumeControl(index);
                return true;
            }
            return false;
        });
    }
}

function render (gameState) {
    bootstrappingObjects(gameState.bootstrapping);
    updatePositions(gameState.objects);
    mouseInteraction(gameState);
    camera.position.x = gameState.player.mesh.position.x;
    camera.lookAt(gameState.player.mesh.position);
    camera.rotation.z = 0;
    renderer.render(scene, camera);
    removeObjects(gameState.tombstoned);
}

function initialize () {
    document.body.appendChild(renderer.domElement);
}

module.exports = {
    initialize: initialize,
    render: render
};

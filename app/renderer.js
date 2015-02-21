'use strict';
var THREE = require('three');
var lights = require('./lights');
var scene = new THREE.Scene();

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

var yawUpdate = Math.PI / 180;
var pitchUpdate = 0.1;
var pitchLowerBound = 1;
var pitchDefault = 6;
var pitchUppderBound = 10;
//var cameraY = 0.5;
//var cameraZ = 6;

function updateCameraPosition(gameState) {
    camera.position.x = gameState.player.mesh.position.x;
    camera.lookAt(gameState.player.mesh.position);
    camera.rotation.z = 0;

    if (!gameState.camera.yaw) {
        gameState.camera.yaw = 0;
    }
    if (gameState.camera.yawLeft) {
        gameState.camera.yaw += yawUpdate;
    }
    if (gameState.camera.yawRight) {
        gameState.camera.yaw -= yawUpdate;
    }
    //camera.rotation.x = gameState.camera.yaw;
    //console.log(camera.rotation.x);

    if (!gameState.camera.pitch) {
        gameState.camera.pitch = pitchDefault;
    }
    if (gameState.camera.pitchUp) {
        gameState.camera.pitch += pitchUpdate;
        if (gameState.camera.pitch > pitchUppderBound) {
            gameState.camera.pitch = pitchUppderBound;
        }
    }
    if (gameState.camera.pitchDown) {
        gameState.camera.pitch -= pitchUpdate;
        if (gameState.camera.pitch < pitchLowerBound) {
            gameState.camera.pitch = pitchLowerBound;
        }
    }

    camera.position.z = gameState.camera.pitch;
    //camera.rotation.y = gameState.camera.pitch;
    //camera.position.z = cameraZ;
    //camera.position.y = cameraY;
    //console.log(gameState.camera.pitch);

    //camera.position.x = gameState.camera.yaw;
    //camera.rotation.y = gameState.camera.pitch;
    //console.log('x', gameState.player.mesh.position.x);
}

function render (gameState) {
    bootstrappingObjects(gameState.bootstrapping);
    updatePositions(gameState.objects);
    updateCameraPosition(gameState);
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

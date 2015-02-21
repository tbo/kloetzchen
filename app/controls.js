var KEYCODE_SPACE = 32;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;
var KEYCODE_S = 83;
var KEYCODE_W = 87;
var KEYCODE_UP = 38;
var KEYCODE_A = 65;
var KEYCODE_D = 68;
var KEYCODE_E = 69;
var KEYCODE_Q = 81;

var left = false;
var right = false;
var rotateLeft = false;
var rotateRight = false;
var up = false;
var down = false; // jshint ignore:line
var forward = false;
var backward = false;
var mouse = {
    down: false,
    up: false,
    moving: false,
    x: null,
    y: null
};

var yawLeft = false;
var yawRight = false;

var pitchUp = false;
var pitchDown = false;

function onKey(v) {
    return function ( event ) {
        // event.preventDefault();
        switch ( event.keyCode ) {
            case KEYCODE_LEFT: yawLeft = v; break;
            case KEYCODE_A: left = v; break;

            case KEYCODE_RIGHT: yawRight = v; break;
            case KEYCODE_D: right = v; break;
            case KEYCODE_E: rotateRight = v; break;
            case KEYCODE_Q: rotateLeft = v; break;

            case KEYCODE_SPACE: up = v; break;

            case KEYCODE_UP: pitchUp = v; break;
            case KEYCODE_W: forward = v; break;

            case KEYCODE_DOWN: pitchDown = v; break;
            case KEYCODE_S: backward = v; break;
        }
    };
}

function translateMovement(gameState) {
    console.log(gameState.camera.yaw);
    gameState.player.movement.up = up;

    if (gameState.camera.yaw >= -90 && gameState.camera.yaw < 90) {
        gameState.player.movement.forward = forward;
        gameState.player.movement.backward = backward;
        gameState.player.movement.left = left;
        gameState.player.movement.right = right;
    } else {
        gameState.player.movement.forward = backward;
        gameState.player.movement.backward = forward;
        gameState.player.movement.left = right;
        gameState.player.movement.right = left;
    }
}

function onMouseDown(e) {
    mouse.down = true;
    mouse.up = false;
    mouse.moving = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function onMouseMove(e) {
    mouse.moving = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function onMouseUp() {
    mouse.down = false;
    mouse.up = true;
    mouse.moving = false;
    mouse.x = null;
    mouse.y = null;
}

function updateValue(value, update, lowerBound, upperBound) {
    var newValue = value + update;
    if (newValue > upperBound) {
        if (Math.abs(lowerBound) === Math.abs(upperBound)) {
            newValue = lowerBound;
        } else {
            newValue = upperBound;
        }
    }
    if (newValue < lowerBound) {
        if (Math.abs(lowerBound) === Math.abs(upperBound)) {
            newValue = upperBound;
        } else {
            newValue = lowerBound;
        }
    }
    return newValue;
}

document.addEventListener( 'keydown', onKey(true), false );
document.addEventListener( 'keyup', onKey(false), false );
window.addEventListener('mousemove', onMouseMove, false );
window.addEventListener('mousedown', onMouseDown, false );
window.addEventListener('mouseup', onMouseUp, false );

module.exports = function(gameState) {
    gameState.player.movement.up = up;
    gameState.player.movement.forward = forward;
    gameState.player.movement.backward = backward;
    gameState.player.movement.left = left;
    gameState.player.movement.right = right;
    gameState.player.movement.rotateRight = rotateRight;
    gameState.player.movement.rotateLeft = rotateLeft;
    if(gameState.controls.mouse.up) {
        mouse.up = false;
    }
    if(gameState.controls.mouse.down) {
        mouse.down = false;
    }
    gameState.controls.mouse.up = mouse.up;
    gameState.controls.mouse.down = mouse.down;
    gameState.controls.mouse.moving = mouse.moving;
    gameState.controls.mouse.x = mouse.x;
    gameState.controls.mouse.y = mouse.y;

    gameState.camera.yawLeft = yawLeft;
    gameState.camera.yawRight = yawRight;

    const yawUpdate = 1;
    if (gameState.camera.yaw === undefined) {
        gameState.camera.yaw = 0;
    }
    if (gameState.camera.yawLeft) {
        gameState.camera.yaw = updateValue(gameState.camera.yaw, -yawUpdate, -180, 180);
    }
    if (gameState.camera.yawRight) {
        gameState.camera.yaw = updateValue(gameState.camera.yaw, yawUpdate, -180, 180);
    }
    translateMovement(gameState);

    gameState.camera.pitchUp = pitchUp;
    gameState.camera.pitchDown = pitchDown;
};

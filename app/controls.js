var KEYCODE_SPACE = 32;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;
var KEYCODE_S = 83;
var KEYCODE_W = 87;
var KEYCODE_UP = 38;
var KEYCODE_A = 65;
var KEYCODE_D = 68;

var left = false;
var right = false;
var up = false;
var down = false; // jshint ignore:line
var forward = false;
var backward = false;

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

            case KEYCODE_SPACE: up = v; break;

            case KEYCODE_UP: pitchUp = v; break;
            case KEYCODE_W: forward = v; break;

            case KEYCODE_DOWN: pitchDown = v; break;
            case KEYCODE_S: backward = v; break;
        }
    };
}

document.addEventListener( 'keydown', onKey(true), false );
document.addEventListener( 'keyup', onKey(false), false );

module.exports = function(gameState) {
    gameState.player.movement.up = up;
    gameState.player.movement.forward = forward;
    gameState.player.movement.backward = backward;
    gameState.player.movement.left = left;
    gameState.player.movement.right = right;

    if (!gameState.camera) {
        gameState.camera = {};
    }
    gameState.camera.yawLeft = yawLeft;
    gameState.camera.yawRight = yawRight;

    gameState.camera.pitchUp = pitchUp;
    gameState.camera.pitchDown = pitchDown;
};

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
var mouse = {
    down: false,
    up: false,
    moving: false,
    x: null,
    y: null
};

function onKey(v) {
    return function ( event ) {
        // event.preventDefault();
        switch ( event.keyCode ) {
            case KEYCODE_LEFT: 
            case KEYCODE_A: left = v; break;

            case KEYCODE_RIGHT: 
            case KEYCODE_D: right = v; break;

            case KEYCODE_SPACE: up = v; break;

            case KEYCODE_UP: 
            case KEYCODE_W: forward = v; break;

            case KEYCODE_DOWN: 
            case KEYCODE_S: backward = v; break;
        }
    };
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
};

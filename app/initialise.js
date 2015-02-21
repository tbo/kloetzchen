
var createCuboid = require('./createCuboid');
function initialise(gameState) {
    gameState.addCuboid(createCuboid(0, 0));
    gameState.addCuboid(createCuboid(0, 1));
    gameState.addCuboid(createCuboid(0, 2));
    gameState.addCuboid(createCuboid(1, 0));
    gameState.addCuboid(createCuboid(1, 1));
    gameState.addCuboid(createCuboid(1, 2));
}

module.exports = initialise;

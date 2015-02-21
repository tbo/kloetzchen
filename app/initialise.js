
var createCuboid = require('./createCuboid');
function initialise(gameState) {
    for(let row = 0; row < 15; ++row ) {
        gameState.addCuboid(createCuboid(row, 0));
        gameState.addCuboid(createCuboid(row, 1));
        gameState.addCuboid(createCuboid(row, 2));

    }
}

module.exports = initialise;

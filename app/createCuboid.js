
const CUBE_HEIGHT = 0.5;
const CUBE_WIDTH = 1.0;

function createCuboid(row, position) {
    var x,y,z, zRotation = 0.0;

    if (row % 2 === 0) {
        zRotation = Math.PI;
        x = 0.0;
        y = position * CUBE_WIDTH;
    } else {
        x = position * CUBE_WIDTH;
        y = 0.0;
    }

    z = row * CUBE_HEIGHT;


    return { x, y, z, zRotation };

}


module.exports = createCuboid;



const CUBE_HEIGHT = 1;
const CUBE_WIDTH = 2.0;
const CUBE_LENGTH = 3.0;

function createCuboid(row, position) {
    var x,y,z, zRotation = 0.0;

    if (row % 2 === 0) {
        x = position * CUBE_WIDTH;
        y = 0.0;
    } else {
        zRotation = Math.PI / 2;
        x = (CUBE_LENGTH / 2) + (CUBE_WIDTH / 4.0);
        y = (position - 1)* CUBE_WIDTH;
    }

    z = (row  * CUBE_HEIGHT) + (CUBE_HEIGHT / 2.0);

    return { x, y, z, zRotation };

}


module.exports = createCuboid;


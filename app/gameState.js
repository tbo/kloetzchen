function getObjectPrototype() {
    return {
        mesh: null,
        body: null,
        movement: {}
    };
}

var gameState = {
        
        controls: {mouse: {}},
        objects: [],
        bootstrapping: [],
        tombstoned: [],
        player: { movement: {}, body: {}, mesh: { position: {x:0, y:0, z: 0} } }
        camera: {},
   
 
    add(type, x, y, z) {
        var newObject = getObjectPrototype();
        newObject.type = type;
        newObject.initialPosition = {x, y, z};
        return this.bootstrapping.push(newObject) - 1;
    },
    addCuboid(position) {
        var newObject = getObjectPrototype();
        newObject.type = 'cube';
        newObject.initialPosition = position;
        return this.state.bootstrapping.push(newObject) - 1;
    },
    remove(index) {
        return this.tombstoned.push(this.objects.splice(index, 1).pop()) - 1;
    },
    assumeControl(index) {
        this.player = this.objects[index];
    },
    pipe(transformer) {
        transformer(this);
        return this;
    }
};
//gameState.add('cube', 0, 0, 15);
//gameState.state.player = gameState.state.bootstrapping[0];
gameState.camera = {};

module.exports = gameState;

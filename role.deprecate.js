var roleDeprecate = {

    /** @param {Creep} creep **/
    run: function(creep, spawn) {
        creep.moveTo(spawn);
        spawn.recycleCreep(creep);
    }
};

module.exports = roleDeprecate;
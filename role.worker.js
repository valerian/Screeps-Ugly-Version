var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep, spawn) {
        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            var result = creep.build(target);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { reusePath: 0 });
            } else if (result == ERR_INVALID_TARGET) {
                creep.moveTo(spawn.pos);
            }
        }
        else {
            if (!creep.pos.inRangeTo(creep.room.controller, 2))
                creep.moveTo(creep.room.controller, { reusePath: 0 });
            creep.upgradeController(creep.room.controller);
        }
	}
};

module.exports = roleWorker;
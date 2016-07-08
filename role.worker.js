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
            if (creep.carry.energy < creep.carryCapacity * 0.75 && Memory.containers && Memory.containers[spawn.name] && Memory.containers[spawn.name].controller) {
                let controllerContainer = Game.getObjectById(Memory.containers[spawn.name].controller[0]);
                if (controllerContainer)
                    if (controllerContainer.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(controllerContainer);
            }
            creep.upgradeController(creep.room.controller);
        }
	}
};

module.exports = roleWorker;
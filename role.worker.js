var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep, spawn) {
        if(!creep.pos)
            return;
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            let result = creep.build(target);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { reusePath: 2 });
            } else if (result == ERR_INVALID_TARGET) {
                creep.moveTo(spawn.pos, { reusePath: 2 });
            }
        } /* else if (creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_TOWER }).length == 0) {
            if (!target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 5000 });
            if (!target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 10000 });
            if (!target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 20000 });
            if (!target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 50000 });
            if (target) {
                let result = creep.repair(target);
                if (result == ERR_NOT_IN_RANGE)
                    creep.moveTo(target, { reusePath: 0 });
            }
        } */
        if (!target) {
            if (!creep.pos.inRangeTo(creep.room.controller, 1))
                creep.moveTo(creep.room.controller, { reusePath: 2 });
            if (creep.carry.energy < creep.carryCapacity * 0.75 && Memory.containers && Memory.containers[spawn.name] && Memory.containers[spawn.name].controller) {
                let controllerContainer = Game.getObjectById(Memory.containers[spawn.name].controller[0]);
                if (controllerContainer)
                    if (controllerContainer.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(controllerContainer, { reusePath: 2 });
            }
            creep.upgradeController(creep.room.controller);
        }
	}
};

module.exports = roleWorker;
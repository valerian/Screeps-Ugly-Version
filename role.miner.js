var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep, spawn) {
        if (!creep.memory.group)
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
        else
            var source = Game.getObjectById(spawn.memory.sources[creep.memory.group - 1]);
        var result = creep.harvest(source);
        if (result == ERR_NOT_IN_RANGE || result == ERR_NOT_ENOUGH_RESOURCES) {
            creep.moveTo(source, { reusePath: 5 });
        } else {
            var link = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK });
            if (link && link.energy < link.energyCapacity && link.pos.getRangeTo(creep.pos) <= 2)
                creep.transfer(link, RESOURCE_ENERGY);
            else
                creep.drop(RESOURCE_ENERGY);
            if (creep.memory.group) {
                var container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && creep.pos.getRangeTo(structure.pos) < 4 });
                if (container) {
                    if (creep.pos.getRangeTo(container.pos) > 0)
                        creep.move(creep.pos.getDirectionTo(container.pos));
                }
            }
        }

	}
};

module.exports = roleMiner;
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, spawn) {
	    if(creep.carry.energy < creep.carryCapacity) {
            if (!creep.memory.group)
                var source = creep.room.find(FIND_SOURCES)[0];
            else
                var source = Game.getObjectById(spawn.memory.sources[creep.memory.group - 1]);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
	}
};

module.exports = roleHarvester;
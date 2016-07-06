var roleGatherer = {

    /** @param {Creep} creep **/
    run: function(creep, spawn) {
        if (!creep.memory.emptying) {
            var toGather;
            if (!creep.memory.group) {
                var link = null;
                if (Memory.links[spawn.name] && Memory.links[spawn.name].target)
                    link = Memory.links[spawn.name].target;
                if (!toGather)
                    toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 1200 });
                /*if (!toGather && spawn.memory.needEnergy)
                    toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > creep.carryCapacity });*/
                if (!toGather)
                    toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 1500) ||
                                                                                                     (structure.id == link && structure.energy > 600) });
                if (!toGather) {
                    if (creep.room.find(FIND_HOSTILE_CREEPS, { filter: (c) => _.filter(c.body, (b) => b.type == 'attack'|| b.type == 'ranged_attack').length > 0 }).length == 0)
                        toGather = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > 100 });
                }
                if (!toGather)
                    toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 600) ||
                                                                                                     (structure.id == link && structure.energy > 300) });
                if (!toGather)
                    toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 300) ||
                                                                                                     (structure.id == link && structure.energy > 200) });
                if (!toGather)
                    toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 150) ||
                                                                                                     (structure.id == link && structure.energy > 100) });
                if (!toGather) {
                    if (creep.room.find(FIND_HOSTILE_CREEPS, { filter: (c) => _.filter(c.body, (b) => b.type == 'attack'|| b.type == 'ranged_attack').length > 0 }).length == 0)
                        toGather = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > 0 });
                }
                if (!toGather)
                    toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0) ||
                                                                                                     (structure.id == link && structure.energy > 0) });
            }
            else
            {
                var location = Game.getObjectById(spawn.memory.sources[creep.memory.group - 1]).pos;
                var results = creep.room.lookForAtArea(LOOK_ENERGY, location.y - 2, location.x - 2, location.y + 2, location.x + 2, true);
                if (results.length)
                    toGather = results[0].energy;
                else {
                    results = _.filter(creep.room.lookForAtArea(LOOK_STRUCTURES, location.y - 2, location.x - 2, location.y + 2, location.x + 2, true), (item) => item.structure.structureType == STRUCTURE_CONTAINER && item.structure.store[RESOURCE_ENERGY] > 0);
                    if (results.length)
                        toGather = results[0].structure;
                }
            }
            if (toGather && creep.carry.energy < creep.carryCapacity) {
                if ((toGather.transferEnergy ? toGather.transferEnergy(creep) : (toGather.transfer ? toGather.transfer(creep, RESOURCE_ENERGY) : creep.pickup(toGather))) == ERR_NOT_IN_RANGE)
                    creep.moveTo(toGather);
            }
            if (!toGather && creep.memory.group)
            {
                var container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && creep.pos.getRangeTo(structure.pos) == 0 });
                if (container)
                    creep.move(creep.pos.getDirectionTo(spawn));
            }
            if (!toGather)
                creep.memory.idleTicks = creep.memory.idleTicks ? creep.memory.idleTicks + 1 : 1;
            else
                creep.memory.idleTicks = 0;
            if (creep.memory.idleTicks > 5)
                creep.memory.emptying = true;
                
        }
        if (_.sum(creep.carry) == creep.carryCapacity || creep.memory.emptying) {
            creep.memory.emptying = true;
            let target;
            /*target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_SPAWN &&
                            structure.energy < 250;
                    }
            });
            if (!target)
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_EXTENSION &&
                                structure.energy < structure.energyCapacity;
                        }
                });
            if (!target)
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_SPAWN &&
                                structure.energy < structure.energyCapacity;
                        }
                });*/
            if (!target)
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
                                    structure.energy < structure.energyCapacity;
                        }
                });
            if (!target)
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_STORAGE });
            /*if (!target)
                target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy <= structure.energyCapacity * 0.33});*/
            if (!target)
                target = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (creep) => (creep.memory.role == 'worker' || creep.memory.role == 'mason') && creep.carry.energy == 0 });
            if (!target)
                target = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (creep) => (creep.memory.role == 'worker' || creep.memory.role == 'mason') && creep.carry.energy <= (creep.carryCapacity / 2) });
            if (!target)
                target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy <= structure.energyCapacity * 0.66});
            if (!target)
                target = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (creep) => (creep.memory.role == 'worker' || creep.memory.role == 'mason') && creep.carry.energy < creep.carryCapacity });
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { reusePath: 0 });
                }
            } else {
                creep.moveTo(spawn);
            }
            if (creep.carry.energy == 0)
                creep.memory.emptying = false;
        }
	}
};

module.exports = roleGatherer;
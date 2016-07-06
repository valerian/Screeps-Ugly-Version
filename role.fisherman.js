module.exports = {
    run: function(creep, spawn) {
        let flag = Game.flags.harvest;
        
        if(flag && creep.room.name != Game.spawns[creep.memory.mother].room.name) {
            let enemy = creep.room.find(FIND_HOSTILE_CREEPS)[0];
            if (enemy)
                Memory.spooked = enemy.ticksToLive - 200;
        }
        
	    if(flag && !creep.memory.emptying && creep.carry.energy < creep.carryCapacity) {
            let target;
            if (creep.room.name != Game.spawns[creep.memory.mother].room.name) {
                target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (source) => source.room.name != spawn.room.name && source.energy > 0});
                if (target) {
                    if((target.energyCapacity ? creep.harvest(target) : creep.pickup(target)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
            if (!target)
                creep.moveTo(flag);
        }
        
        if (creep.carry.energy == creep.carryCapacity || creep.memory.emptying) {
            creep.memory.emptying = true;
            let target;
            
            if (flag && creep.room.name == flag.pos.roomName) {
                target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (target) {
                    let result = creep.build(target);
                    if (result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { reusePath: 0 });
                    } else if (result == ERR_INVALID_TARGET) {
                        creep.moveTo(flag.pos);
                    }
                }
            }
            
            if (!target) {
                if (Memory.links[spawn.name] && Memory.links[spawn.name].source) {
                    let link = Game.getObjectById(Memory.links[spawn.name].source);
                    if (link && link.energy < link.energyCapacity)
                        target = link;
                }
                if (!target)
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity / 2)
                                || (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity);
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
                    });
                if (!target)
                    target = spawn;
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { reusePath: 0 });
                    }
                }
            }
            if (creep.carry.energy == 0)
                creep.memory.emptying = false;
        }
	}
};
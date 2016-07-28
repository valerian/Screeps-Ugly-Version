//var profiler = require('screeps-profiler');

var roleSupplier = {

    run: function(creep, spawn) {
        if (creep.carry.energy == 0 || creep.memory.refilling) {
            var target;
            if (Game.time % 5 && !creep.memory.cacheInvalidate) {
                target = creep.memory.toGather && Game.getObjectById(creep.memory.toGather);
                creep.memory.cacheInvalidate = false;
            } else {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] >= 50
                });
                
                if (!spawn.room.storage && !spawn.memory.needEnergy) {
                    if (!target) {
                        if (creep.room.find(FIND_HOSTILE_CREEPS, { filter: (c) => _.filter(c.body, (b) => b.type == 'attack'|| b.type == 'ranged_attack').length > 0 }).length == 0)
                            target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > (creep.carryCapacity - creep.carry.energy) });
                    }
                    if (!target)
                        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { 
                            filter: (structure) =>
                                ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                 (structure.energy >= (creep.carryCapacity - creep.carry.energy))) ||
                                (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= (creep.carryCapacity - creep.carry.energy))
                        });
                    if (!target)
                        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { 
                            filter: (structure) =>
                                (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                (structure.energy > ((creep.carryCapacity - creep.carry.energy) / 2))
                        });
                    if (!target)
                        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { 
                            filter: (structure) =>
                                (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                (structure.energy >= 50)
                        });
                    if (!target)
                        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { 
                            filter: (structure) =>
                                (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                (structure.energy > 10)
                        });
                    if (!target)
                        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
                        });
                }
                creep.memory.toGather = target && target.id;
            }
            
            if (target) {
                if ((target.transferEnergy ? target.transferEnergy(creep) : (target.transfer ? target.transfer(creep, RESOURCE_ENERGY) : creep.pickup(target))) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target, { reusePath: 2 });
                else {
                    creep.memory.toGather = null;
                    creep.memory.cacheInvalidate = true;
                }
            }
            
            if (!target) {
                creep.memory.idleTicks = creep.memory.idleTicks ? creep.memory.idleTicks + 1 : 1;
                if (creep.pos.getRangeTo((creep.room.storage || spawn).pos) > 1)
                    creep.moveTo(creep.room.storage || spawn);
            } else {
                creep.memory.idleTicks = 0;
            }
            creep.memory.refilling = _.sum(creep.carry) < creep.carryCapacity && creep.memory.idleTicks < 5;
        } else {
            creep.memory.refilling = false;
            let controllerContainer = null
            if (Memory.containers && Memory.containers[spawn.name] && Memory.containers[spawn.name].controller)
                controllerContainer = Memory.containers[spawn.name].controller[0];
            //console.log(controllerContainer);
            //console.log(creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.id == controllerContainer && structure.store[RESOURCE_ENERGY] < 1200}));
            let toSupply;
            if (Game.time % 5 && !creep.memory.cacheInvalidate) {
                toSupply = creep.memory.toSupply && Game.getObjectById(creep.memory.toSupply);
                creep.memory.cacheInvalidate = false;
            } else {
                if (!toSupply)
                    toSupply = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy <= structure.energyCapacity * 0.33});
                if (!toSupply && controllerContainer)
                    toSupply = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.id == controllerContainer && structure.store[RESOURCE_ENERGY] < 1200});
                if (!toSupply)
                    toSupply = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (creep) => (creep.memory.role == 'worker' || creep.memory.role == 'mason') && creep.carry.energy == 0 });
                if (!toSupply)
                    toSupply = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (creep) => (creep.memory.role == 'worker' || creep.memory.role == 'mason') && creep.carry.energy <= (creep.carryCapacity / 2) });
                if (!toSupply)
                    toSupply = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy <= structure.energyCapacity * 0.66});
                if (!toSupply && controllerContainer)
                    toSupply = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.id == controllerContainer && structure.store[RESOURCE_ENERGY] < 2000});
                if (!toSupply)
                    toSupply = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (creep) => (creep.memory.role == 'worker' || creep.memory.role == 'mason') && creep.carry.energy < creep.carryCapacity });
                creep.memory.toSupply = toSupply && toSupply.id;                
            }
            if (toSupply && !creep.memory.refilling && creep.carry.energy > 0) {
                if(creep.transfer(toSupply, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(toSupply, { reusePath: 2 });
                } else {
                    creep.memory.toSupply = null;
                    creep.memory.cacheInvalidate = true;
                }
            }
        }
    }
};

module.exports = roleSupplier;

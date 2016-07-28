//var profiler = require('screeps-profiler');

var roleGatherer = {

    /** @param {Creep} creep **/
    run: function(creep, spawn) {
        if (!creep.memory.emptying) {
            var toGather;
            if (Game.time % 5 && !creep.memory.cacheInvalidate) {
                toGather = creep.memory.toGather && Game.getObjectById(creep.memory.toGather);
                creep.memory.cacheInvalidate = false;
            } else {
                if (!creep.memory.group) {
                    let link = null;
                    let controllerContainer = null
                    if (Memory.containers && Memory.containers[spawn.name] && Memory.containers[spawn.name].controller)
                        controllerContainer = Memory.containers[spawn.name].controller[0];
                    if (Memory.links[spawn.name] && Memory.links[spawn.name].target)
                        link = Memory.links[spawn.name].target;
                    if (!toGather)
                        toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 1600 && structure.id != controllerContainer) ||
                                                                                                         (structure.id == link && structure.energy > 600) });
                    if (!toGather) {
                        if (creep.room.find(FIND_HOSTILE_CREEPS, { filter: (c) => _.filter(c.body, (b) => b.type == 'attack'|| b.type == 'ranged_attack').length > 0 }).length == 0)
                            toGather = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > 100 });
                    }
                    if (!toGather)
                        toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 800 && structure.id != controllerContainer });
                    /*if (!toGather)
                        toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 600 && structure.id != controllerContainer) ||
                                                                                                         (structure.id == link && structure.energy > 300) });*/
                    if (!toGather)
                        toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 300 && structure.id != controllerContainer) ||
                                                                                                         (structure.id == link && structure.energy > 200) });
                    /*if (!toGather)
                        toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 150 && structure.id != controllerContainer) ||
                                                                                                         (structure.id == link && structure.energy > 100) });*/
                    if (!toGather) {
                        if (creep.room.find(FIND_HOSTILE_CREEPS, { filter: (c) => _.filter(c.body, (b) => (b.type == 'attack'|| b.type == 'ranged_attack') && c.owner.username != 'Source Keeper').length > 0 }).length == 0)
                            toGather = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > 0 });
                    }
                    if (!toGather)
                        toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0 && structure.id != controllerContainer) ||
                                                                                                         (structure.id == link && structure.energy > 0) });
                    if (!toGather && spawn.memory.needEnergy)
                        toGather = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0 });
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
                creep.memory.toGather = toGather && toGather.id;
            }
            if (toGather && creep.carry.energy < creep.carryCapacity) {
                if ((toGather.transferEnergy ? toGather.transferEnergy(creep) : (toGather.transfer ? toGather.transfer(creep, RESOURCE_ENERGY) : creep.pickup(toGather))) == ERR_NOT_IN_RANGE)
                    creep.moveTo(toGather, { reusePath: 2 });
                else {
                    creep.memory.toGather = undefined;
                    creep.memory.cacheInvalidate = true;
                }
            }
            if (!toGather && creep.memory.group)
            {
                var container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && creep.pos.getRangeTo(structure.pos) == 0 });
                if (container)
                    creep.move(creep.pos.getDirectionTo(spawn, { reusePath: 2 }));
            }
            if (!toGather)
                creep.memory.idleTicks = creep.memory.idleTicks ? creep.memory.idleTicks + 1 : 1;
            else
                creep.memory.idleTicks = 0;
            if (creep.memory.idleTicks >= 4)
                creep.memory.emptying = true;
                
        }
        if (_.sum(creep.carry) == creep.carryCapacity || creep.memory.emptying) {
            creep.memory.emptying = true;
            let target;
            if (Game.time % 5 && !creep.memory.cacheInvalidate) {
                target = creep.memory.toDrop && Game.getObjectById(creep.memory.toDrop);
                creep.memory.cacheInvalidate = false;
            } else {
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
                                        structure.energy < structure.energyCapacity;
                            }
                    });
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_STORAGE });
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (creep) => (creep.memory.role == 'worker' || creep.memory.role == 'mason') && creep.carry.energy == 0 });
                if (!target)
                    target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy <= structure.energyCapacity * 0.66});
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (creep) => (creep.memory.role == 'worker' || creep.memory.role == 'mason') && creep.carry.energy < creep.carryCapacity });
                creep.memory.toDrop = target && target.id;
            }
            if(target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { reusePath: 2 });
                } else { 
                    creep.memory.toDrop = undefined;
                    creep.memory.cacheInvalidate = true;
                }
            } else {
                creep.moveTo(spawn, { reusePath: 2 });
            }
            if (creep.carry.energy == 0)
                creep.memory.emptying = false;
        }
	}
};

module.exports = roleGatherer;

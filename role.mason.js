/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.mason');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep, spawn) {
        if (true/*!creep.memory.refilling && creep.carry.energy > 0*/) {
            var target;
            if (!target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) =>
                        structure.hits < 25000 &&
                        (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) &&
                        structure.pos.lookFor(LOOK_FLAGS).length == 0
                });
            if (!target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) =>
                        structure.hits < 50000 &&
                        (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) &&
                        structure.pos.lookFor(LOOK_FLAGS).length == 0
                });
            if (!target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) =>
                        structure.hits < 100000 &&
                        (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) &&
                        structure.pos.lookFor(LOOK_FLAGS).length == 0
                });
            if (!target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) =>
                        structure.hits < 200000 &&
                        (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) &&
                        structure.pos.lookFor(LOOK_FLAGS).length == 0
                });
            if (!target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) =>
                        structure.hits < 300000 &&
                        (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) &&
                        structure.pos.lookFor(LOOK_FLAGS).length == 0
                });
            if (!target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) =>
                        structure.hits < 500000 &&
                        (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) &&
                        structure.pos.lookFor(LOOK_FLAGS).length == 0
                });
            if (!target)
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) =>
                        structure.hits < 1000000 &&
                        (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) &&
                        structure.pos.lookFor(LOOK_FLAGS).length == 0
                });
            if (target)
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { reusePath: 0 });
                }
        } /*else {
            creep.memory.refilling = true;
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) =>
                    (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) &&
                    structure.pos.lookFor(LOOK_FLAGS).length > 0
            });
            if (target) {
                if(creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { reusePath: 0 });
                }
            } else {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] >= 50
                });
                if(target) {
                    if(target.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { reusePath: 0 });
                    }
                }
            }
            
            if (creep.carry.energy == creep.carryCapacity)
                creep.memory.refilling = false;
        }*/
    }
};
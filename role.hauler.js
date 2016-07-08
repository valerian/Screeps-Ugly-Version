var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep, spawn) {
        let flag = Game.flags.prospect;
        let target;
        if (!flag) {
            creep.moveTo(spawn);
            spawn.recycleCreep(creep);
            return;
        }
        if (creep.room.name == flag.pos.roomName) {
            var enemy = creep.room.find(FIND_HOSTILE_CREEPS)[0];
            if (enemy)
                Memory.spooked = enemy.ticksToLive - 150;
            if (!creep.memory.emptying && creep.carry.energy < creep.carryCapacity) {
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > 4000 && r.pos.roomName == creep.room.name });
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > 2000 && r.pos.roomName == creep.room.name });
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > 1000 && r.pos.roomName == creep.room.name });
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > 500 && r.pos.roomName == creep.room.name });
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > 250 && r.pos.roomName == creep.room.name });
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > 0 && r.pos.roomName == creep.room.name });
                if (!target && creep.carry.energy > creep.carryCapacity * 0.5)
                    creep.memory.emptying = true;
            }
            
            if (!target)
                creep.moveTo(flag);
            else
                if (creep.pickup(target) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target);
        }
        if (creep.carry.energy == creep.carryCapacity || creep.memory.emptying) {
            creep.memory.emptying = true;
            
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_STORAGE });
            if (!target)
                creep.moveTo(spawn);
            else
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target, { reusePath: 0 });
            if (creep.carry.energy == 0)
                creep.memory.emptying = false;
        }
        if (creep.room.name != flag.pos.roomName && !creep.memory.emptying) {
            if (!creep.memory.emptying && creep.carry.energy < creep.carryCapacity
                && creep.room.name != Game.spawns[creep.memory.mother].room.name
                && creep.room.name != flag.pos.roomName) {
                target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if (target) {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE)
                        creep.moveTo(target);
                } else
                    creep.moveTo(flag);
            } else
                creep.moveTo(flag);
        }
	}
};

module.exports = roleHauler;
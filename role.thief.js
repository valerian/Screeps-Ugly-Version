module.exports = {
    run: function(creep, spawn) {
        let flag = Game.flags.steal;
        
        if(flag && creep.room.name == flag.pos.roomName) {
            let enemy = creep.room.find(FIND_HOSTILE_CREEPS, { filter: (c) => _.filter(c.body, (b) => b.type == 'attack'|| b.type == 'ranged_attack').length > 0 })[0];
            /*if (enemy)
                Memory.spookedThief = enemy.ticksToLive - 100;*/
        }
        
	    if(flag && !creep.memory.emptying && creep.carry.energy < creep.carryCapacity) {
            let target;
            if (creep.room.name == flag.pos.roomName) {
                target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if (target) {
                    if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            } else {
                creep.moveTo(flag);
            }
        }
        
        if (creep.carry.energy == creep.carryCapacity || creep.memory.emptying) {
            creep.memory.emptying = true;
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_STORAGE && structure.my });
            if (!target)
                target = spawn;
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    if (creep.pos.y == 49)
                        creep.move(TOP);
                    else
                        creep.moveTo(target, { reusePath: 0 });
                }
            }
            if (creep.carry.energy == 0)
                creep.memory.emptying = false;
        }
	}
};
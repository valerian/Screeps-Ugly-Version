module.exports = {
    run: function(creep, spawn) {
        let flag = Game.flags.attack;
        
	    if (flag) {
            let target;
            if (creep.room.name == Game.flags.attack.pos.roomName) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) =>
                            (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART)
                            && s.hits < 100
                    });
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) =>
                            (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART)
                            && s.hits < 10000
                    });
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) =>
                            (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART)
                            && s.hits < 100000
                    });
                if (!target)
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) =>
                            (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART)
                    });
                if (target) {
                    if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                if (creep.room.find(FIND_HOSTILE_SPAWNS).length == 0) {
                    //Game.flags.attack.remove();
                }
            }
            if (!target)
                creep.moveTo(flag);
        }
        else {
            creep.moveTo(spawn);
            spawn.recycleCreep(creep);
        }
    }
};
module.exports = {
    run: function(creep, spawn) {
        flag = Game.flags.harvest;
        
        if(flag && creep.room.name == flag.pos.roomName) {
            var enemy = creep.room.find(FIND_HOSTILE_CREEPS)[0];
            if (enemy)
                Memory.spooked = enemy.ticksToLive - 100;
        }
        
	    if(flag) {
            var target;
            if (creep.room.name == flag.pos.roomName) {
                if (!creep.pos.inRangeTo(creep.room.controller, 1))
                    creep.moveTo(creep.room.controller, { reusePath: 0 });
                else {
                    creep.claimController(creep.room.controller);
                }
            } else {
                creep.moveTo(flag);
            }
        }
	}
};
var roleProspector = {

    /** @param {Creep} creep **/
    run: function(creep, spawn) {
        let flag = Game.flags.prospect;
        if (!flag) {
            creep.moveTo(spawn);
            spawn.recycleCreep(creep);
            return;
        }
        if (creep.room.name == flag.pos.roomName) {
            var enemy = creep.room.find(FIND_HOSTILE_CREEPS)[0];
            if (enemy)
                Memory.spooked = enemy.ticksToLive - 150;
            var target = creep.pos.findClosestByPath(FIND_SOURCES);
            var result = creep.harvest(target);
            if (result == ERR_NOT_IN_RANGE || result == ERR_NOT_ENOUGH_RESOURCES) {
                creep.moveTo(target, { reusePath: 0 });
            } else {
                creep.drop(RESOURCE_ENERGY);
            }
        } else {
            creep.moveTo(flag);
        }
	}
};

module.exports = roleProspector;
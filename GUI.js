var creepFactory = require('creepFactory');

module.exports = {
    run: function() {
        if (Game.flags.SAY) {
            var localCreeps = _.filter(Game.creeps, (c) => c.my && c.room.name == Game.flags.SAY.pos.roomName);
            for (i in localCreeps) {
                localCreeps[i].say(localCreeps[i].memory.role + (localCreeps[i].memory.group ? ' ' + localCreeps[i].memory.group : ''));
            }
        }
        if (Game.flags.GUI_STOP) {
            this.reset();
            Game.flags.GUI_STOP.remove();
        }
        if (Game.flags.GUI) {
            if (Memory.GUI)
                this.reset();
            else {
                Memory.GUI = { root: Game.flags.GUI.pos, flags: { }};
                Game.flags.GUI.remove();
            }
        }
        if (!Memory.GUI)
            return;
        if (Game.time % 100 == 0) {
            this.clean();
            return;
        }
        var spawnCreeps = _.filter(Game.creeps, (c) => c.my && c.memory.mother == "Spawn1");
        this.updateFlag('spawn energy', 'spawn E: ' + Game.rooms[Memory.GUI.root.roomName].energyAvailable, 0, 0);
        this.updateFlag('store energy', 'storage E: ' + Game.rooms[Memory.GUI.root.roomName].storage.store.energy, 0, 2);
        this.updateFlag('number of creeps', '# of creeps: ' + _.filter(spawnCreeps, (c) => c.my).length, 0, 4);
        var queue = '(' + creepFactory.queue.length + ')';
        if (creepFactory.queue[0])
            queue += ' ' + creepFactory.queue[0].role + (creepFactory.queue[0].group ? ':' + creepFactory.queue[0].group : '');
        if (creepFactory.queue[1])
            queue += ', ...';
        
        //console.log(JSON.stringify(creepFactory.queue));
        
        this.updateFlag('spawn queue label', 'spawn queue:', -2, 6);
        this.updateFlag('spawn queue', queue, 3, 6);
        
        this.updateFlag('spawning label', 'spawning:', -2, 8);
        this.updateFlag('spawning', Game.spawns.Spawn1.spawning && Memory.creeps[Game.spawns.Spawn1.spawning.name] ? Memory.creeps[Game.spawns.Spawn1.spawning.name].role + (Memory.creeps[Game.spawns.Spawn1.spawning.name].group ? ':' + Memory.creeps[Game.spawns.Spawn1.spawning.name].group : '') : '(not spawning)', 3, 8);
        
        this.updateFlag('next creep to die label', 'next creep to die:', -2, 10);
        var nextDeath =  _.sortBy(spawnCreeps, (c) => c.ticksToLive);
        if (nextDeath[0])
            this.updateFlag('next creep to die', nextDeath[0].memory.role + ( nextDeath[0].memory.group ? ':' + nextDeath[0].memory.group : '') + ' (' + nextDeath[0].ticksToLive + ')', 3, 10);
        else
            this.updateFlag('next creep to die', '(no creeps)', 3, 10);
        this.updateFlag('next creep to die label 2', 'next creep to die 2:', -2, 12);
        if (nextDeath[1])
            this.updateFlag('next creep to die 2', nextDeath[1].memory.role + ( nextDeath[1].memory.group ? ':' + nextDeath[1].memory.group : '') + ' (' + nextDeath[1].ticksToLive + ')', 3, 12);
        else
            this.updateFlag('next creep to die 2', '(not enough creeps)', 3, 12);
    },
    
    reset: function() {
        if (!Memory.GUI)
            return;
        this.clean();
        delete Memory.GUI;
    },
    
    updateFlag: function(identifier, value, x, y) {
        if (Memory.GUI.flags[identifier] == value)
            return;
        if (Game.flags[Memory.GUI.flags[identifier]])
            Game.flags[Memory.GUI.flags[identifier]].remove();
        Game.rooms[Memory.GUI.root.roomName].createFlag(Memory.GUI.root.x + x, Memory.GUI.root.y + y, value);
        Memory.GUI.flags[identifier] = value;
    },
    
    clean: function() {
        if (!Memory.GUI)
            return;
        for (i in Memory.GUI.flags) {
            if (Game.flags[Memory.GUI.flags[i]]) {
                var look = Game.flags[Memory.GUI.flags[i]].pos.look();
                for (j in look)
                    if (look[j].type == 'flag') {
                        look[j].flag.remove();
                    }
            }
        }
        for (var flag in Memory.GUI.flags) {
            if (Game.flags[Memory.GUI.flags[flag]])
                Game.flags[Memory.GUI.flags[flag]].remove();
            delete Memory.GUI.flags[flag];
        }
    }
};
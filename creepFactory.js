/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creepFactory');
 * mod.thing == 'a thing'; // true
 */

var creepFactory = {
    willBeSpawned: "nothing",
    queue: [],
    
    createIfLessThan: function(spawn, role, level, quantity, group) {
        //console.log('[' + spawn.name + ']trying to create if less than ' + quantity + ': level ' + level + " " + role + " (group " + group + ")");
        if (group) {
            if (spawn.spawning && Memory.creeps[spawn.spawning.name] && Memory.creeps[spawn.spawning.name].role == role && Memory.creeps[spawn.spawning.name].group == group)
                quantity--;
            if (_.filter(Game.creeps, (creep) => creep.my && creep.memory.mother == spawn.name && creep.memory.role == role && creep.memory.group == group && creep.ticksToLive > (20 * level) + 20 && creep.hits == creep.hitsMax).length < quantity) {
                return this.create(spawn, role, level, group);
            }
        }
        else {
            //console.log("this");
            if (spawn.spawning && Memory.creeps[spawn.spawning.name] && Memory.creeps[spawn.spawning.name].role == role && !Memory.creeps[spawn.spawning.name].group)
                quantity--;
            if (_.filter(Game.creeps, (creep) => creep.my && creep.memory.mother == spawn.name && creep.memory.role == role && !creep.memory.group && creep.ticksToLive > (20 * level) + 20 && creep.hits == creep.hitsMax).length < quantity) {
                return this.create(spawn, role, level);
            }
        }
        return false;
    },
    
    create: function(spawn, role, level, group) {
        //console.log('=> trying to spawn: level ' + level + " " + role + " (group " + group + ")");
        //console.log(this.roles[role][level]);
        //return;
        level = (typeof level === 'undefined') ? 1 : level;
        if (spawn.canCreateCreep(this.roles[role][level]) == 0) {
            let memory = { role: role, level: level, mother: spawn.name };
            if (group !== undefined)
                memory.group = group;
            //console.log(JSON.stringify(memory) + " : " + this.roles[role][level]);
            let result = false;
            result = spawn.createCreep(this.roles[role][level], null, memory);
            if (result && typeof result == "string") {
                this.willBeSpawned = "level " + level + " " + role;
                if (group)
                    this.willBeSpawned += " (group " + group + ")";
            }
            return result;
        }
        this.queue.unshift({ role: role, level: level, group: group });
        spawn.memory.needEnergy = true;
        //console.log(spawn.memory.needEnergy);
        return false;
    },
    
    roles:
    {
        bootstrapper:
        {
            1: [WORK, CARRY, MOVE, MOVE]
        },
        
        gatherer:
        {
            1: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            2: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            3: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            4: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            5: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        
        miner:
        {
            1: [WORK, WORK, MOVE],
            2: [WORK, WORK, WORK, WORK, WORK, MOVE],
            3: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
        },
        
        supplier:
        {
            1: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            2: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            3: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            4: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            5: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        
        worker:
        {
            1: [WORK, WORK, CARRY, MOVE],
            2: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
            3: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            4: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        
        fisherman:
        {
            3: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            4: [WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            5: [WORK, WORK, WORK, WORK, WORK, WORK, 
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        
        mason:
        {
            4: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        
        lighthouse:
        {
            3: [CLAIM, MOVE],
            4: [CLAIM, CLAIM, MOVE, MOVE]
        },
        
        thief:
        {
            5: [CARRY, CARRY, CARRY,
                CARRY, CARRY, CARRY,
                CARRY, CARRY, CARRY,
                CARRY, CARRY, CARRY,
                CARRY, CARRY, CARRY,
                CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE,]
        }
    }
};

module.exports = creepFactory;

module.exports = {
    links: function(spawn) {
        if (!Memory.links)
            Memory.links = { };
        Memory.links[spawn.name];
        var target = spawn.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK });
        if (!target)
            return;
        var sources = spawn.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK && s.id != target.id });
        if (sources.length == 0)
            return;
        Memory.links[spawn.name] = { sources: [], target: target.id };
        for (let i in sources) {
            Memory.links[spawn.name].sources.push(sources[i].id);
            if (sources[i].energy > 100 && target.energy < 750)
                sources[i].transferEnergy(target);
        }
    },
    
    containers: function(spawn) {
        if (!Memory.containers)
            Memory.containers = { };
        if (!Memory.containers[spawn.name])
            Memory.containers[spawn.name] = { };
        if (!Memory.containers[spawn.name].controller || Memory.containers[spawn.name].controller.length == 0) {
            let containers = spawn.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.pos.getRangeTo(spawn.room.controller) <= 3 });
            Memory.containers[spawn.name].controller = [];
            for (let i in containers)
                Memory.containers[spawn.name].controller.push(containers[i].id);    
        }
    },
    
    run: function(spawn) {
        this.links(spawn);
        //this.containers(spawn);
    }
};
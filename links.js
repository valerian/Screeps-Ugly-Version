module.exports = {
    run: function(spawn) {
        if (!Memory.links)
            Memory.links = { };
        Memory.links[spawn.name];
        var links = spawn.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK });
        if (links.length != 2)
            return;
        var target = spawn.pos.findClosestByRange([links[0], links[1]]);
        var source = links[0] == target ? links[1] : links[0];
        Memory.links[spawn.name] = { source: source.id, target: target.id };
        if (source.energy > 100 && target.energy < 800)
            source.transferEnergy(target);
        //console.log(`source: ${source}, target ${target}`);
    }
};
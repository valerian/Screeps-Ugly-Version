module.exports = {
    run: function(tower) {
        //console.log("test");
        if (!Memory.towers)
            Memory.towers = {};
        if (!Memory.towers[tower.id])
            Memory.towers[tower.id] = {};
                
        var hostile;
        /*if (!hostile)
            hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (c) => _.filter(c.body, (b) => b.type == 'heal' && b.hits > 0).length > 0 });*/
        if (!hostile)
            hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
            tower.attack(hostile);
            return;
        }
        
        if (Memory.towers[tower.id].idleTTL >= 0) {
            Memory.towers[tower.id].idleTTL--;
            return;
        }
        
        var closestDamagedStructure;
        
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 1000 
            });
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 5000 
        });
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 25000 
        });
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 100000 
        });
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 250000 && (structure.structureType == STRUCTURE_RAMPART || structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_CONTAINER)
        });
        
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        } else {
            Memory.towers[tower.id].idleTTL = 4 + Math.round(Math.random() * 5);
        }
    }
};
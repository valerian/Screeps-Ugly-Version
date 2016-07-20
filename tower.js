module.exports = {
    run: function(tower) {
        //console.log("test");
        
        var hostile;
        /*if (!hostile)
            hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (c) => _.filter(c.body, (b) => b.type == 'heal' && b.hits > 0).length > 0 });*/
        if (!hostile)
            hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
            tower.attack(hostile);
            return;
        }
        
        var closestDamagedStructure;
        
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 1000 
            });
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 2000 
            });
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 5000 
        });
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 10000 
        });
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 25000 
        });
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 50000 
        });
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 100000 
        });
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 250000 && structure.structureType == STRUCTURE_CONTAINER
        });
        
        if (!closestDamagedStructure)
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 300000 && (structure.structureType == STRUCTURE_RAMPART || structure.structureType == STRUCTURE_WALL)
        });
        if (!closestDamagedStructure && tower.room.name == 'W11N38')
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 450000 && (structure.structureType == STRUCTURE_RAMPART || structure.structureType == STRUCTURE_WALL)
        });
        
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    }
};
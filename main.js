//import toto from "testing.thing";

var roleDeprecate = require('role.deprecate');
var roleGatherer = require('role.gatherer');
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleSupplier = require('role.supplier');
var roleWorker = require('role.worker');
var roleFisherman = require('role.fisherman');
var roleLighthouse = require('role.lighthouse');
var roleMason = require('role.mason');
var roleThief = require('role.thief');
var roleRam = require('role.ram');
var roleHauler = require('role.hauler');
var roleProspector = require('role.prospector');
var creepFactory = require('creepFactory');
var defendRoom = require('defendRoom');
var towerScript = require('tower');
var structuresScript = require('structures');
var GUI = require('GUI');

//console.log("toto: " + toto);

//var profiler = require('screeps-profiler');
//profiler.enable();

function runRoom(spawn) {
    var spawnCreeps = _.filter(Game.creeps, (c) => c.my && c.memory.mother == spawn.name);
    var localStructures = _.filter(Game.structures, (s) => s.room == spawn.room);
    
    defendRoom.defend(spawn.room);

    if (Game.flags.prospect && Game.flags.prospect.pos.roomName == spawn.room.name)
        Game.flags.prospect.remove();
    
    spawn.memory.needEnergy = false;
    
    if (!spawn.memory.sources) {
        let sourcesFound = spawn.room.find(FIND_SOURCES);
        spawn.memory.sources = [sourcesFound[0].id];
        if (sourcesFound.length > 1) {
            spawn.memory.sources[1] = sourcesFound[1].id;
            if (sourcesFound[0].pos.getRangeTo(spawn.pos) > sourcesFound[1].pos.getRangeTo(spawn.pos))
                spawn.memory.sources = [sourcesFound[1].id, sourcesFound[0].id]
        }
    }
    
    if (spawn.room.controller.level >= 3 && Game.flags.tower && Game.flags.tower.room.name == spawn.room.name) {
        spawn.room.createConstructionSite(Game.flags.tower.pos, STRUCTURE_TOWER);
        Game.flags.tower.remove();
    }
    
    var developmentLevel = 0;
    if (spawnCreeps.length >= 2)
    {
        developmentLevel = 1;
        if (spawnCreeps.length >= 4)
            developmentLevel = 2;
        if (spawnCreeps.length >= 5)
            developmentLevel = 3;
        if (spawn.room.controller.level >= 2 && spawnCreeps.length >= 5)
        {
            developmentLevel = 4;
            if (_.filter(localStructures, (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.my).length >= 5)
                developmentLevel = 5;
            if (_.filter(localStructures, (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.my).length >= 10 && spawnCreeps.length >= 8)
                developmentLevel = 6;
            if (_.filter(localStructures, (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.my).length >= 20 && spawnCreeps.length >= 7)
                developmentLevel = 7;
            if (_.filter(localStructures, (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.my).length >= 30 && spawnCreeps.length >= 6)
                developmentLevel = 8;
            if (_.filter(localStructures, (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.my).length >= 40 && spawnCreeps.length >= 6)
                developmentLevel = 9;
        }
    }
    


    //console.log(creepFactory.create);

    switch (developmentLevel) {
        case 0:
            creepFactory.createIfLessThan(spawn, 'bootstrapper', 1, 1, 1);
            break;
        case 1:
            creepFactory.createIfLessThan(spawn, 'gatherer', 1, 1);
            creepFactory.createIfLessThan(spawn, 'bootstrapper', 1, 1, 1);
            creepFactory.createIfLessThan(spawn, 'gatherer', 1, 1, 2);
            creepFactory.createIfLessThan(spawn, 'miner', 1, 1, 2);
            break;
        case 2:
            creepFactory.createIfLessThan(spawn, 'gatherer', 1, 1);
            creepFactory.createIfLessThan(spawn, 'gatherer', 1, 1, 1);
            creepFactory.createIfLessThan(spawn, 'miner', 1, 1, 1);
            creepFactory.createIfLessThan(spawn, 'gatherer', 1, 1, 2);
            creepFactory.createIfLessThan(spawn, 'miner', 1, 1, 2);
            break;
        case 3:
            creepFactory.createIfLessThan(spawn, 'worker', 1, 3);
            creepFactory.createIfLessThan(spawn, 'supplier', 1, 2);
            creepFactory.createIfLessThan(spawn, 'gatherer', 1, 1);
            creepFactory.createIfLessThan(spawn, 'gatherer', 1, 1, 1);
            creepFactory.createIfLessThan(spawn, 'miner', 1, 1, 1);
            creepFactory.createIfLessThan(spawn, 'gatherer', 1, 1, 2);
            creepFactory.createIfLessThan(spawn, 'miner', 1, 1, 2);
            break;
        case 4:
            /*if (spawn.memory.developmentLevel == 3) {
                console.log('creating construction sites');
                spawn.room.createConstructionSite(spawn.pos.x - 1, spawn.pos.y - 2, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawn.pos.x + 1, spawn.pos.y - 2, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawn.pos.x - 2, spawn.pos.y + 1, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawn.pos.x + 2, spawn.pos.y + 1, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawn.pos.x, spawn.pos.y + 2, STRUCTURE_EXTENSION);
            }*/
            creepFactory.createIfLessThan(spawn, 'worker', 1, 3);
            creepFactory.createIfLessThan(spawn, 'supplier', 1, 1);
            creepFactory.createIfLessThan(spawn, 'gatherer', 1, 1);
            creepFactory.createIfLessThan(spawn, 'gatherer', 1, 1, 1);
            creepFactory.createIfLessThan(spawn, 'miner', 1, 1, 1);
            creepFactory.createIfLessThan(spawn, 'gatherer', 1, 1, 2);
            creepFactory.createIfLessThan(spawn, 'miner', 1, 1, 2);
            //creepFactory.createIfLessThan(spawn, 'miner', 1, 1);
            break;
        case 5:
            creepFactory.createIfLessThan(spawn, 'worker', 2, (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0 ? 3 : 5));
            creepFactory.createIfLessThan(spawn, 'supplier', 2, 2);
            creepFactory.createIfLessThan(spawn, 'gatherer', 2, 1, 1);
            creepFactory.createIfLessThan(spawn, 'gatherer', 2, 1, 2);
            creepFactory.createIfLessThan(spawn, 'miner', 2, 1, 2);
            creepFactory.createIfLessThan(spawn, 'miner', 2, 1, 1);
            creepFactory.createIfLessThan(spawn, 'gatherer', 2, 1);
            break;
        case 6:
            /*if (Memory.spooked == 0)
                creepFactory.createIfLessThan(spawn, 'fisherman', 3, 3);*/
            //creepFactory.createIfLessThan(spawn, 'mason', 3, 1);
            creepFactory.createIfLessThan(spawn, 'supplier', 3, (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0 ? 2 : 2));
            creepFactory.createIfLessThan(spawn, 'worker', 3, (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0 ? 2 : 4));
            creepFactory.createIfLessThan(spawn, 'gatherer', 3, 1, 1);
            creepFactory.createIfLessThan(spawn, 'gatherer', 3, 1, 2);
            creepFactory.createIfLessThan(spawn, 'gatherer', 3, 1);
            creepFactory.createIfLessThan(spawn, 'miner', 3, 1, 1);
            creepFactory.createIfLessThan(spawn, 'miner', 3, 1, 2);
            break;
        case 7:
            //creepFactory.createIfLessThan(spawn, 'mason', 4, 1);
            creepFactory.createIfLessThan(spawn, 'worker', 4, (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0 ? 2 : 2));
            creepFactory.createIfLessThan(spawn, 'supplier', 4, (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0 ? 2 : 2));
            creepFactory.createIfLessThan(spawn, 'gatherer', 4, 1);
            /*if (Memory.spooked == 0) {
                creepFactory.createIfLessThan(spawn, 'fisherman', 5, 2);
                creepFactory.createIfLessThan(spawn, 'lighthouse', 3, 1);
            }*/
            //creepFactory.createIfLessThan(spawn, 'gatherer', 3, 1, 1);
            if (!Memory.links[spawn.name])
                creepFactory.createIfLessThan(spawn, 'gatherer', 3, 1, 2);
            creepFactory.createIfLessThan(spawn, 'miner', 3, 1, 1);
            creepFactory.createIfLessThan(spawn, 'miner', 3, 1, 2);
            if (Memory.spookedThief == 0 && Game.flags.steal) {
                //creepFactory.createIfLessThan(spawn, 'thief', 5, 1);
            }
            break;
        case 8:
            //creepFactory.createIfLessThan(spawn, 'mason', 4, 1);
            if (Game.flags.attack && spawn.name == 'Spawn1')
                creepFactory.createIfLessThan(spawn, 'ram', 3, 1);
            creepFactory.createIfLessThan(spawn, 'worker', 4, (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0 ? 2 : 2));
            creepFactory.createIfLessThan(spawn, 'supplier', 5, (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0 ? 1 : 1));
            creepFactory.createIfLessThan(spawn, 'gatherer', 5, 1);
            if (Memory.spooked == 0 && Game.flags.harvest) {
                creepFactory.createIfLessThan(spawn, 'fisherman', 5, 3);
                //creepFactory.createIfLessThan(spawn, 'lighthouse', 3, 1);
            }
            //creepFactory.createIfLessThan(spawn, 'gatherer', 3, 1, 1);
            //creepFactory.createIfLessThan(spawn, 'gatherer', 3, 1, 2);
            creepFactory.createIfLessThan(spawn, 'miner', 3, 1, 1);
            creepFactory.createIfLessThan(spawn, 'miner', 3, 1, 2);
            if (Memory.spookedThief == 0 && Game.flags.steal && spawn.name == 'Spawn1') {
                //creepFactory.createIfLessThan(spawn, 'thief', 5, 1);
            }
            break;
        case 9:
            //creepFactory.createIfLessThan(spawn, 'mason', 4, 1);
            if (Game.flags.attack && spawn.name == 'Spawn1')
                creepFactory.createIfLessThan(spawn, 'ram', 3, 1);
            if (Game.flags.prospect && spawn.name == 'Spawn1' && Memory.spooked == 0) {
                creepFactory.createIfLessThan(spawn, 'hauler', 5, 3);
                creepFactory.createIfLessThan(spawn, 'prospector', 4, 2);
                //creepFactory.createIfLessThan(spawn, 'lighthouse', 4, 1);
            }
            creepFactory.createIfLessThan(spawn, 'worker', 4, (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0 ? 2 : 2));
            creepFactory.createIfLessThan(spawn, 'supplier', 5, (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0 ? 1 : 1));
            creepFactory.createIfLessThan(spawn, 'gatherer', 3, 2);
            if (Memory.spooked == 0 && Game.flags.harvest && spawn.name == 'Spawn1') {
                creepFactory.createIfLessThan(spawn, 'fisherman', 5, 3);
                //creepFactory.createIfLessThan(spawn, 'lighthouse', 3, 1);
            }
            //creepFactory.createIfLessThan(spawn, 'gatherer', 3, 1, 1);
            //creepFactory.createIfLessThan(spawn, 'gatherer', 3, 1, 2);
            creepFactory.createIfLessThan(spawn, 'miner', 3, 1, 1);
            creepFactory.createIfLessThan(spawn, 'miner', 3, 1, 2);
            if (Memory.spookedThief == 0 && Game.flags.steal && spawn.name == 'Spawn1') {
                //creepFactory.createIfLessThan(spawn, 'thief', 5, 1);
            }
            break;
        default:
            break;
    }
    
    if (spawn.memory.developmentLevel != developmentLevel) {
        console.log("[" + spawn.name + "] development level: " + spawn.memory.developmentLevel + " -> " + developmentLevel);
        spawn.memory.developmentLevel = developmentLevel;
    }
    
    if (creepFactory.willBeSpawned != "nothing") {
        console.log("[" + spawn.name + "] a " + creepFactory.willBeSpawned + " is spawning!");
        //Game.notify("a " + creepFactory.willBeSpawned + " is spawning!");
        creepFactory.willBeSpawned = "nothing";
    }
    //console.log(developmentLevel);
    //console.log(localStructures.length);
    //console.log(localStructures.filter((structure) => { return (structure.structureType == STRUCTURE_EXTENSION && structure.my) }).length);

    for(var name in spawnCreeps) {
        var creep = spawnCreeps[name];
        if (creep.hits < creep.hitsMax || creep.memory.deprecate == true)
            roleDeprecate.run(creep, spawn);
        else {
            if(creep.memory.role == 'bootstrapper') {
                switch (developmentLevel) {
                    case 0:
                        roleHarvester.run(creep, spawn);
                        break;
                    case 1:
                    case 2:
                    case 3:
                        roleMiner.run(creep, spawn);
                        break;
                    default:
                        roleDeprecate.run(creep, spawn);
                        break;
                }
            }
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep, spawn);
            }
            if(creep.memory.role == 'worker') {
                roleWorker.run(creep, spawn);
            }
            if(creep.memory.role == 'gatherer') {
                roleGatherer.run(creep, spawn);
            }
            if(creep.memory.role == 'miner') {
                if (developmentLevel >= 5 && creep.memory.level == 1 && spawn.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role == 'miner' && c.ticksToLive > creep.ticksToLive }).length > 0)
                    roleDeprecate.run(creep, spawn);
                else
                    roleMiner.run(creep, spawn);
            }
            if(creep.memory.role == 'supplier') {
                roleSupplier.run(creep, spawn);
            }
            if(creep.memory.role == 'fisherman') {
                if (Memory.spooked == 0 && Game.flags.harvest)
                    roleFisherman.run(creep, spawn);
                else
                    roleDeprecate.run(creep, spawn);
            }
            if(creep.memory.role == 'thief') {/*
                if (Memory.spookedThief == 0 && Game.flags.steal)
                    roleThief.run(creep, spawn);
                else*/
                    roleDeprecate.run(creep, spawn);
            }
            if(creep.memory.role == 'lighthouse') {
                if (Memory.spooked == 0 && Game.flags.prospect)
                    roleLighthouse.run(creep, spawn);
                else
                    roleDeprecate.run(creep, spawn);
            }
            if(creep.memory.role == 'mason') {
                //roleMason.run(creep, spawn);
                roleDeprecate.run(creep, spawn);
            }
            if(creep.memory.role == 'ram') {
                roleRam.run(creep, spawn);
                //roleDeprecate.run(creep, spawn);
            }            
            if(creep.memory.role == 'hauler') {
                if (Memory.spooked == 0 && Game.flags.prospect)
                    roleHauler.run(creep, spawn);
                else
                    roleDeprecate.run(creep, spawn);
            }            
            if(creep.memory.role == 'prospector') {
                if (Memory.spooked == 0 && Game.flags.prospect)
                    roleProspector.run(creep, spawn);
                else
                    roleDeprecate.run(creep, spawn);
            }
        }
    }
    
    spawn.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}).forEach(tower => towerScript.run(tower));
    structuresScript.run(spawn);
}

module.exports.loop = function() { 
    //profiler.wrap(function() {
    
    //global.testt = "test";
    
    for (let i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
    creepFactory.queue = {};
    var mySpawns = _.filter(Game.spawns, (s) => s.my);
    
    if (Game.flags.harvest && Game.flags.harvest.room)
        defendRoom.defend(Game.flags.harvest.room);
    if (Game.flags.prospect && Game.flags.prospect.room)
        defendRoom.defend(Game.flags.prospect.room);
    
    for (let i in mySpawns) {
        creepFactory.queue[mySpawns[i].name] = [];
        //console.log(JSON.stringify(creepFactory.queue));
        runRoom(mySpawns[i]);
    }
        
    GUI.run();
    
    if (!Memory.spooked)
        Memory.spooked = 0;
    if (Memory.spooked > 0)
        Memory.spooked--;
    else
        Memory.spooked = 0;
        
    if (!Memory.spookedThief)
        Memory.spookedThief = 0;
    if (Memory.spookedThief > 0)
        Memory.spookedThief--;
    else
        Memory.spookedThief = 0;
    //});
}

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('defendRoom');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    defend: function(room) {
        
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            var roomname = room.name;
            var time = Game.time;
            Game.notify(`User ${username} spotted in room ${roomname} at ${time}`);
            console.log(`User ${username} spotted in room ${roomname} at ${time}`);
        }
    }
};
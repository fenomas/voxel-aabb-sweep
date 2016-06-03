'use strict'

var test = require('tap').test

var AABB = require('../reference/aabb')
var sweep = require('../index')


var N = 500

test("multiple hits", function (t) {

    var box = new AABB([0,0,0], [0,0,0])
    var dir = [0, 0, 0]
    var callback = function (dist, axis, dir, vec) {
        vec[axis] = 0
    }
    
    var ok, cache
    var getVoxels = function (x,y,z) {
        var id = x + '|' + y + '|' + z
        if (cache[id]) ok = false
        cache[id] = 1
    }

    for (var i = 0; i < N; i++) {
        // randomize
        for (var j = 0; j < 3; j++) {
            box.base[j] = 1 - 2 * Math.random()
            box.max[j] = box.base[j] + 0.01 + 5 * Math.random()
            dir[j] = 20 * (0.5 - Math.random())
        }
        
        ok = true
        cache = {}
        var res = sweep(getVoxels, box, dir, callback)
        
        if (!ok) {
            t.fail('Same voxel queried twice for same sweep, on ' + i + 'th test')
            break
        }
    }

    if (ok) t.pass('Passed ' + N + ' random tests without a multiple query.')
    
    t.end()
})



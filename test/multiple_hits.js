'use strict'

var test = require('tap').test

var sweep = require('../index')



test("basics", function (t) {


    var box = {
        base: [0, 0, 0],
        max: [0, 0, 0],
    }
    var dir = [0, 0, 0]

    var ok = true
    var hits
    var getVoxel = function (x, y, z) {
        var id = x + '|' + y + '|' + z
        if (hits[id]) {
            t.fail('Queried same voxel more than once')
            ok = false
        }
        hits[id] = 1
        return false
    }

    function trial() {
        hits = {}
        for (var i = 0; i < 3; i++) {
            box.base[i] = Math.random()
            box.max[i] = box.base[i] + 3 * Math.random()
            dir[i] = 10 - 20 * Math.random
        }
        return sweep(getVoxel, box, dir)
    }

    var N = 1000, ct = 0
    do {
        trial()
    } while (++ct < N && ok)
    
    if (ok) t.pass('Ran '+N+' trials without querying the same voxel twice')


    t.end()
})

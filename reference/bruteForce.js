'use strict'


// slow, brute force implementation of sweep for verifying correct results


function sweep_impl(getVoxel,
    xbase, ybase, zbase,
    xmax, ymax, zmax,
    dx, dy, dz,
    max_d, hit_pos, hit_norm) {

    // move AABB along direction vector in very small steps looking for a collision

    var N = 1e5

    // coords of leading corner in each axis
    var px = (dx > 0) ? xmax : xbase
    var py = (dy > 0) ? ymax : ybase
    var pz = (dz > 0) ? zmax : zbase

    // float coords of trailing corner in each axis
    var tx = (dx > 0) ? xbase : xmax
    var ty = (dy > 0) ? ybase : ymax
    var tz = (dz > 0) ? zbase : zmax

    // stepping directions in each axis
    var stepx = max_d * dx / N
    var stepy = max_d * dy / N
    var stepz = max_d * dz / N
    
    // main loop
    var floor = Math.floor
    var ct = 0

    while (ct < N) {

        // check for collisions
        var x0 = (dx > 0) ? tx : px
        var y0 = (dy > 0) ? ty : py
        var z0 = (dz > 0) ? tz : pz

        var x1 = px + tx - x0
        var y1 = py + ty - y0
        var z1 = pz + tz - z0

        var voxel
        outer:
        for (var x = floor(x0); x < x1; x++) {
            for (var y = floor(y0); y < y1; y++) {
                for (var z = floor(z0); z < z1; z++) {
                    voxel = getVoxel(x, y, z)
                    if (voxel) break outer
                }
            }
        }

        if (voxel) {
            if (hit_pos) {
                hit_pos[0] = Math.min(px, tx)
                hit_pos[1] = Math.min(py, ty)
                hit_pos[2] = Math.min(pz, tz)
            }
            if (hit_norm) {
                hit_norm[0] = hit_norm[1] = hit_norm[2] = 0
            }

            return max_d * ct / N
        }

        // step along vector by d/N
        
        ct++

        px += stepx
        py += stepy
        pz += stepz

        tx += stepx
        ty += stepy
        tz += stepz

    }

    // no voxel hit found
    if (hit_pos) {
        hit_pos[0] = px
        hit_pos[1] = py
        hit_pos[2] = pz
    }
    if (hit_norm) {
        hit_norm[0] = hit_norm[1] = hit_norm[2] = 0
    }

    return max_d

}




// conform inputs

function sweep(getVoxel, box, direction, hit_pos, hit_norm) {
    var bx = +box.base[0]
    var by = +box.base[1]
    var bz = +box.base[2]
    var mx = +box.max[0]
    var my = +box.max[1]
    var mz = +box.max[2]

    var dx = +direction[0]
    var dy = +direction[1]
    var dz = +direction[2]
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

    if (dist === 0) {
        throw new Error("Can't sweep along a zero vector")
    }

    dx /= dist
    dy /= dist
    dz /= dist

    return sweep_impl(
        getVoxel,
        bx, by, bz,
        mx, my, mz,
        dx, dy, dz, dist,
        hit_pos, hit_norm
    )
}

module.exports = sweep


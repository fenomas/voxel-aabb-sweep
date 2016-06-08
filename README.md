## voxel-aabb-sweep

Sweep an AABB along a vector and find where it collides with a set of voxels. 

There are other libraries that do this naively, by sweeping the AABB along 
each axis in turn, but this is inaccurate for larger movements, 
and it gives anisotropic results (i.e. it prefers to collide in some axes over others).

In contrast this library essentially raycasts along the the AABB's leading corner, 
and each time the ray crosses a voxel boundary, it checks for collisions across the 
AABB's leading face in that axis. This gives correct results even across long movements,
with reasonably solid performance.
 
The raycasting algorithm is from [fast-voxel-raycast](https://github.com/andyhall/fast-voxel-raycast).

### Installation

```sh
npm install voxel-aabb-sweep
```
    
### Usage

```js
var sweep = require('voxel-aabb-sweep')
var callback = function (dist, axis, dir, vec) { /* .. */ }
var distance = sweep(getVoxels, box, vector, callback, noTranslate, epsilon)
```

 * `distance` - the total scalar distance the AABB moved during the sweep
 * `getVoxel` - a `function(x,y,z)` that returns a truthy value for voxels that collide the AABB
 * `box` - an object shaped like an [aabb-3d](https://github.com/andyhall/aabb-3d)
 * `vector` - vector along which the AABB is to move. E.g. `[5, 10, -3]`
 * `callback` - A function that will get called when a collision occurs.
 * `noTranslate` - (default false) If true, the AABB will not be translated to its new position.
 * `epsilon` - (default 1e-10) Rounding factor by which an AABB must cross a voxel boundary to count

The collision callback:

 * `dist` - the scalar distance moved so far in the sweep
 * `axis` - the axis in which a collision occured
 * `dir` - movement direction (1 or -1) along the collision axis
 * `vec` - the vector distance remaining to be moved (can and probably should be updated by the callback)
 * *return value*: if you return true the sweep will end at the collision; otherwise it will continue along `vec`
 
Once the sweep ends, `box` will be moved to its final position via its `translate()` method.

### Example

```js
var sweep = require('voxel-aabb-sweep')
var getVoxel = function(x,y,z) { return (y > 5) }
var box = { base: [0,0,0], max: [1,1,1], translate: function() {} }
var vector = [ 5, 10, -4 ]
var dist = sweep( getVoxel, box, vector, function() {
    return true
})
// dist: 5.937171043518958
```

### How to use this library

To use this like a volumetric raycast, and simply find where the first collision occurs,
you'll want to return `true` in the callback (like the example above).

To use this as you might in a physics engine, where collisions mean the AABB stops 
moving in the obstructed direction, but continues along the other axes,
you'll probably want to zero out the obstructed component of the `vec` parameter 
(which signfies how far the AABB has left to sweep) and let the sweep continue:

```js
var dist = sweep( getVoxel, box, vector, function(dist, axis, dir, vec) {
    vec[axis] = 0
    return false
})
```

You could also do something more complicated, like bouncing back along the obstructed axis, etc. 

### Hacking

```sh
# clone this repo
cd voxel-aabb-sweep
npm install     # get dev dependencies
npm test        # run tests
```

### License

&copy; 2016 Andy Hall, MIT license

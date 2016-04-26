## voxel-aabb-sweep

Sweep an AABB along a vector and find where it collides with a set of voxels. 

There are other libraries that do this naively, by sweeping the AABB along each axis in turn, 
but this is inaccurate for larger movements, 
and it gives anisotropic results (i.e. always collides in one axis before the others).

In contrast this library essentially raycasts along the the AABB's leading corner, 
and each time the ray crosses a voxel boundary, it checks for collisions across the 
AABB's leading face in that axis. This gives correct results even across long movements,
with pretty solid performance (it never queries voxels unnecessarily, or more than once).
 
The raycasting algorithm is from [fast-voxel-raycast](https://github.com/andyhall/fast-voxel-raycast).

### Installation

```sh
npm install voxel-aabb-sweep
```
    
### Usage

```js
var sweep = require('voxel-aabb-sweep')
var distance = sweep(getVoxel, box, vector, hit_position, hit_normal)
```

 * `distance` - the total distance the AABB moved without being obstructed
 * `getVoxel` - a `function(x,y,z)` that returns a truthy value for voxels that collide the AABB
 * `box` - an object shaped like: `{ base: [0,0,0], max: [1,1,1] }` (such as an [aabb-3d](https://github.com/andyhall/aabb-3d))
 * `vector` - vector along which the AABB is to move. E.g. `[5, 10, -3]`
 * `hit_position` - (optional) an array which will be populated with the AABB's resulting position.
 * `hit_normal` - (optional) an array which will be populated with a normal vector for any collision.  

If the AABB is obstructed at its starting position, `distance` will be `0`, 
`hit_position` will be equal to `box.base`, and `hit_normal` will be `[0,0,0]`.

If the AABB can move the full length of the vector without collisions, then 
`distance` will be equal to the magnitude of `vector`, 
`hit_position` will be equal to `box.base` plus `vector`, and `hit_normal` will be `[0,0,0]`.

### Example

```js
var getVoxel = function(x,y,z) { return (y > 5) }
var box = { base: [0,0,0], max: [1,1,1] }
var vector = [ 5, 10, -4 ]
var hit_position = []
var hit_normal = []

var sweep = require('voxel-aabb-sweep')
var dist = sweep( getVoxel, box, vector, hit_position, hit_normal )

// dist: 5.937171043518958
// hit_position: [ 2.5, 5, -2 ]
// hit_normal:   [ 0, -1, 0 ]
```

### Hacking

```sh
# clone this repo
cd voxel-aabb-sweep
npm install     # gets dev dependencies
npm test        # run tests
npm run bench   # benchmark
```

### Caveat

As with `fast-voxel-raycast`, no particular behavior is defined for the edge case where
the AABB *precisely* touches the corner of a solid voxel without entering it.

### Credits

&copy; 2016 Andy Hall, MIT license

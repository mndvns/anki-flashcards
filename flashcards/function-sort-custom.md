Write the function `by` so that the albums can be sorted.

```js
const albums = [
  { name: 'Beatles', title: 'White Album', price: 15 },
  { name: 'Zeppelin', title: 'II', price: 7 }
];

albums.sort(by('name'));
albums.sort(by('title'));
albums.sort(by('price'));

function by(propName) {
  // Write this
}
```

===

```js
function by(propName) {
  return function(obj1, obj2) {
    v1 = obj1[propName];
    v2 = obj2[propName];
    if (v1 < v2) {
      return -1;
    } else if (v1 > v2) {
      return 1;
    } else {
      return 0;
    }
  };
}
```

How would you iterate over an array with different `for` loops in JavaScript?

===

Using a basic `for` loop:

```js
const items = ["a", "b", "c"];
for (let i = 0; i < items.length; i++) {
  console.log(`Item: ${items[i]}`);
}
// prints "Item: a", "Item: b", then "Item: c"
```

Using a `for...of` loop:

```js
const items = ["a", "b", "c"];
for (const item of items) {
  console.log(`Item: ${item}`);
}
// prints "Item: a", "Item: b", then "Item: c"
```

How would you iterate over an array with `map` and `forEach` in JavaScript?

===

Using `map`:
```js
["a", "b", "c"].map((letter, index) => letter.toUpperCase() + index);
// returns ["A0", "B1", "C2"]
```

Using `forEach`:
```js
["a", "b", "c"].forEach((letter, index) => console.log(letter.toUpperCase() + index));
// prints "A0", "B1", then "C2"
```

How would you iterate over an object in JavaScript?

===

```js
// To iterate over just the object keys, do this:
for (const key of Object.keys(someObject)) {
  // ...
}

// To iterate over just the object values, do this:
for (const value of Object.values(someObject)) {
  // ...
}

// To iterate over both the keys and values, do this:
for (const [key, value] of Object.entries(someObject)) {
  // ...
}
```

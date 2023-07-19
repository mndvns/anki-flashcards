Rewrite these traditional function expressions as fat arrow functions.

```js
const multiply = function(a, b) {
  return a * b;
};

const greet = function(name) {
  return `Hello, ${name}`;
}

const yell = function() {
  console.log("ARRRRGGG!");
}
```

===

```js
const multiply = (a, b) => a * b;

const greet = name => `Hello, ${name}!`;

const yell = () => console.log("ARRRRGGG!");
```

Compare `map` and `forEach` in JavaScript.

===

```js
const numbers = [1, 2, 3, 4, 5];

// Example using map
const squaredNumbers = numbers.map((num) => num ** 2);
console.log(squaredNumbers);
// Output: [1, 4, 9, 16, 25]

// Example using forEach
const doubledNumbers = [];
numbers.forEach((num) => {
  doubledNumbers.push(num * 2);
});
console.log(doubledNumbers);
// Output: [2, 4, 6, 8, 10]
```

In this example, we have an array of numbers `[1, 2, 3, 4, 5]`. Let's see the differences:

+ Using `map`, we transform each element of the original array by squaring each number using the arrow function `(num) => num ** 2`. The `map` method returns a new array `squaredNumbers` with the squared values.
+ Using `forEach`, we iterate over each element of the array and push the doubled values (`num * 2`) into the `doubledNumbers` array. Note that `forEach` doesn't return a new array. Instead, we manually push the values into the `doubledNumbers` array.

By observing the outputs, you can see that `map` creates a new array with the transformed values, while `forEach` allows us to perform an operation on each element but doesn't generate a new array automatically.

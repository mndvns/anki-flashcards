How do we define default function parameters?

===

Default parameters allow parameters to have a predetermined value in case there is no argument passed into the function or if the argument is `undefined` when called.

```js
function calculateArea(height = 5, width = 5) {
  return height * width;
}
calculateArea(); // returns 25
```

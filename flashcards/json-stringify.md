Here we have a JavaScript object `person` representing a person's details.

```js
const person = {
  name: "John",
  age: 30,
  city: "New York"
};
```

Convert the JavaScript object into a JSON string `jsonString`.

===

```js
const jsonString = JSON.stringify(person);
console.log(jsonString); // Output: {"name":"John","age":30,"city":"New York"}
```

Here we have a JSON string stored in `jsonString`.

```js
const jsonString = '{"name": "John", "age": 30, "city": "New York"}';
```

Convert the JSON string into a JavaScript object `jsonObject`.

===

```js
const jsonObject = JSON.parse(jsonString);

console.log(jsonObject.name); // Output: John
console.log(jsonObject.age); // Output: 30
console.log(jsonObject.city); // Output: New York
```

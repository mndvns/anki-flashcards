Consider the object below.

```js
const person = {
  name: ["Bob", "Smith"],
  age: 32,
  bio: function () {
    console.log(`${this.name[0]} ${this.name[1]} is ${this.age} years old.`);
  },
  introduceSelf: function () {
    console.log(`Hi! I'm ${this.name[0]}.`);
  },
};
```

In our `person` object we've got a number, an array, and two functions.
The first two items are data items, and are referred to as the object's {{c1::properties}}.
The last two items are functions that allow the object to do something with that data, and are referred to as the object's {{c1::methods}}.

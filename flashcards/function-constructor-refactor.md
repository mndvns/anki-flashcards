Consider the function in the code below.

```js
function createPerson(name) {
  const obj = {};
  obj.name = name;
  obj.introduceSelf = function() {
    console.log(`Hi! I'm ${this.name}.`);
  };
  return obj;
}
```

When the function `createPersion` is called, it's given a `name` argument, and returns a new object with a property `name` and a method `introduceSelf`.

Rewrite `createPerson` as a *constructor*.

===

Constructors, by convention, start with a capital letter and are named for the type of object they create.
So we could rewrite our example like this:

```js
function Person(name) {
  this.name = name;
  this.introduceSelf = function () {
    console.log(`Hi! I'm ${this.name}.`);
  };
}
```

To call `Person()` as a constructor, we use `new`:

```js
const salva = new Person("Salva");
salva.name;
salva.introduceSelf();
// "Hi! I'm Salva."

const frankie = new Person("Frankie");
frankie.name;
frankie.introduceSelf();
// "Hi! I'm Frankie."
```

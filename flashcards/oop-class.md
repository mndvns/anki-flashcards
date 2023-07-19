Inside a class, you can define **properties** and **methods**.
Properties represent {{c1::the state or characteristics of an object}}, while methods {{c1::define the actions or behaviors that the object can perform}}.

The class **constructor** is a special method that initializes the object's properties when an instance is created.
It can be defined within a class using the {{c1::`constructor`}} keyword.
It is responsible for {{c1::initializing the object's properties and any other setup that needs to be done}}.

+ Define a `Person` class with a constructor that initializes `name` and `age` properties.
+ Give the class a `sayHello` method that can refer to the object's properties using `this`.

===

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}
```

A class instance is an individual object created from a class.
It is a specific realization or occurrence of a class.
When a new instance is created using the `new` keyword followed by the class name and parentheses, the constructor is invoked, and a unique instance of the class is created.

Instances have access to the properties and methods defined in their class.
You can access these properties and invoke methods using dot notation (`.`) followed by the property or method name.

+ Create an instance `john` of the `Person` class using the `new` keyword.
+ Access the instance's properties (`name` and `age`) and invoke its method (`sayHello`).

===

```js
const john = new Person('John', 25);
console.log(john.name); // Output: John
console.log(john.age); // Output: 25
john.sayHello(); // Output: Hello, my name is John.
```

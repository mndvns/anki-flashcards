JavaScript supports **inheritance**, where a class can inherit properties and methods from a **parent class**.
The new **child class** can add additional properties and methods or override the inherited ones.
This allows developers to reuse code and create **hierarchical relationships**.

Inheritance is achieved using the {{c1::`extends`}} keyword.
In a child class, the {{c1::`super`}} keyword is used to access the parent class's constructor, properties, and methods.

+ Create a `Student` class that extends the `Person` class.
+ Give the `Student` class its own constructor to set the `grade` property and a `study` method.
+ Use the `super` keyword to call the parent class's constructor.
+ Create an instance `jane` of the `Student` class, which inherits the properties and methods from the `Person` class.

===

```js
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }

  study() {
    console.log(`${this.name} is studying.`);
  }
}

const jane = new Student('Jane', 20, 12);
console.log(jane.name); // Output: Jane
console.log(jane.age); // Output: 20
console.log(jane.grade); // Output: 12
jane.sayHello(); // Output: Hello, my name is Jane.
jane.study(); // Output: Jane is studying.
```

Each class instance can have its own unique set of properties that are separate from other instances of the same class.
These properties can be defined within the {{c1::constructor}} or {{c1::assigned later to specific instances}}.

+ Create a `Circle` class with a `radius` property and a `calculateArea` method.
+ Create two instances, `circle1` and `circle2`, with different radius values.
+ For each instance, invoke the `calculateArea` method to calculate the area based on its specific radius.

===

```js
class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  calculateArea() {
    return Math.PI * this.radius ** 2;
  }
}

const circle1 = new Circle(5);
const circle2 = new Circle(10);

console.log(circle1.calculateArea()); // Output: 78.53981633974483
console.log(circle2.calculateArea()); // Output: 314.1592653589793
```

In JavaScript, prototypes are a mechanism for object {{c1::inheritance}}.
Every JavaScript object has an associated prototype, which is {{c1::another object that the current object inherits properties and methods from}}.
Prototypes form the basis of the {{c1::prototype chain}}, which allows objects to {{c1::access properties and methods defined on their prototype and higher up in the chain}}.
Here's how it works:

*Prototype Object*:
{{c1::Each object in JavaScript has a prototype object associated with it.
This prototype object acts as a template or blueprint for the object, defining the shared properties and methods that the object can access.}}

*Prototype {{c1::Chain}}*:
{{c1::When you access a property or method on an object, JavaScript first checks if the object itself has that property or method.
If not, it looks up the prototype chain and checks if the object's prototype has the property or method.
This process continues up the chain until the property or method is found or the end of the chain is reached.}}

*Object {{c1::Inheritance}}*:
{{c1::By defining properties and methods on an object's prototype, those properties and methods are inherited by all objects that have that prototype as their prototype.
This allows for the concept of inheritance, where objects can share common behavior defined in their prototypes.}}

*Modifying Prototypes*:
{{c1::You can modify an object's prototype by adding or modifying properties and methods on it.
Changes made to the prototype will be reflected in all objects that inherit from it.}}

Prototypes enable {{c1::code reuse, inheritance, and efficient memory usage}} in JavaScript.
They provide a powerful way to {{c1::extend and share functionality across objects}}, creating a flexible and dynamic environment for {{c1::object-oriented programming}}.

===

Here's an example of prototypes in action:

```js
// Creating a prototype object
const vehiclePrototype = {
  type: "vehicle",
  startEngine() {
    console.log("Engine started");
  },
};

// Creating objects using the prototype
const car = Object.create(vehiclePrototype);
car.make = "Toyota";
car.model = "Camry";

const bicycle = Object.create(vehiclePrototype);
bicycle.make = "Giant";
bicycle.model = "Escape";

// Accessing properties and methods through prototype chain
console.log(car.make); // Output: Toyota
car.startEngine(); // Output: Engine started

console.log(bicycle.model); // Output: Escape
bicycle.startEngine(); // Output: Engine started
```

In this example, we create a `vehiclePrototype` object that acts as the prototype for other objects.
It has a `type` property and a `startEngine` method.

We then create two objects, `car` and `bicycle`, using `Object.create()` and set specific properties (`make` and `model`) on each object.

Since `car` and `bicycle` inherit from `vehiclePrototype`, they can access and use the `type` property and the `startEngine` method defined on the prototype.
This is possible due to the prototype chain.

By modifying the prototype object, any objects created using that prototype will reflect the changes.
This allows for code reuse and inheritance, where common properties and methods are shared among objects.

This is how prototypes enable objects to access shared functionality and properties through the prototype chain.

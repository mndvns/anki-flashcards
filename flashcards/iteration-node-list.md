```js
const divs = document.querySelectorAll("div");
const texts = divs.map((div) => div.textContent);
```

When we run the code above, we get the following error:

```
Uncaught TypeError: divs.map is not a function
```

What must we do to fix this?

===

In this JavaScript, `divs` is not actually an `Array` — it's a `NodeList`. A `NodeList` is a collection of nodes returned by various DOM methods, including `querySelectorAll`. While a `NodeList` has similarities to an array, it is not a true array and does not inherit array methods like `map`.

To use the `map` method on a `divs`, it must first be converted into an array. Here's how to convert `divs` to an array using `Array.from`:

```js
const texts = Array.from(divs).map((div) => div.textContent);
```

We can also use the spread operator (`...`) to accomplish the same thing.

```js
const texts = [...divs].map((div) => div.textContent);
```

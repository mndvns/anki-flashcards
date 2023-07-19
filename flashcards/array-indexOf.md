```js
const birds = ["Parrot", "Falcon", "Owl"];
```

How do we determine which index `Falcon` is in the `birds` array?

Then, using this index, how can we remove `Falcon` from the array?

===

```js
const index = birds.indexOf("Falcon"); // returns 1

birds.splice(index, 1); // mutates the birds array, removing `Falcon`
```

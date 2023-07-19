Use the array method `map` on `cities` to create a new array called `abbrev`, which should have the value `["MR", "LN", "LL"]`.

```js
const cities = ["Manchester", "London", "Liverpool"];
const abbrev = cities.map(/* Make this work */);
```

===

```js
const cities = ["Manchester", "London", "Liverpool"];
const abbrev = cities.map((city) => city[0] + city[city.length - 1].toUpperCase());
```

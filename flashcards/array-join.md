```js
const data = ["Manchester", "London", "Liverpool", "Birmingham", "Leeds", "Carlisle"];
```

How can we turn `data` into a string with the value below?

```js
"(Manchester|London|Liverpool|Birmingham|Leeds|Carlisle)"
```

===

```js
`(${data.join("|")})`;
// Or
"(" + data.join("|") + ")";
```

```js
const browser = "firefox";
```

How do we append the character `!` to the end of the `browser` string?

===

```js
browser += `!`;
// Or
browser = `${browser}!`;
// Or
browser = browser + "!";
```

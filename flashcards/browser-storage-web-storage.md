{{c1::Web storage}} is a flexible way to store data locally in the browser.
It has two mechanisms: {{c1::`localStorage`}} and {{c1::`sessionStorage`}}.

- {{c1::`localStorage`}}: Data stored in {{c1::`localStorage`}} persists even after the browser is closed and reopened.
It is available across multiple browser tabs and windows, and the data does not have an expiration date unless explicitly removed by the website or cleared by the user.

- {{c1::`sessionStorage`}}: Data stored in {{c1::`sessionStorage`}} is available only for the duration of the browser session.
It is not shared between different tabs or windows of the same browser.
Once the session ends (e.g., the browser is closed), the data is cleared.

===

```js
// Storing data in localStorage
localStorage.setItem("username", "John Doe");

// Retrieving data from localStorage
const username = localStorage.getItem("username");
console.log(username); // Outputs: "John Doe"

// Removing data from localStorage
localStorage.removeItem("username");

// Storing data in sessionStorage
sessionStorage.setItem("token", "abcd1234");

// Retrieving data from sessionStorage
const token = sessionStorage.getItem("token");
console.log(token); // Outputs: "abcd1234"

// Removing data from sessionStorage
sessionStorage.removeItem("token");
```

Keep in mind that the `localStorage` and `sessionStorage` methods can only store string data.
If you need to store complex data structures, you can use `JSON.stringify()` to convert them to strings before storing and `JSON.parse()` to convert them back to their original format when retrieving.

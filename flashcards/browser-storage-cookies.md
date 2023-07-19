Cookies are small {{c1::text}} files that websites can store on a user's device.
They are primarily used for storing small amounts of data, such as {{c1::user preferences or session information}}.
Cookies are automatically sent {{c1::by the browser to the server with each request}}, allowing websites to personalize user experiences.

===

```js
// Setting a cookie
document.cookie = "username=John Doe; expires=Fri, 31 Dec 2023 23:59:59 GMT; path=/";

// Retrieving a cookie
const cookies = document.cookie;
console.log(cookies); // Outputs: "username=John Doe;"

// Deleting a cookie
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
```

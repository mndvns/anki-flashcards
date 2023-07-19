```js
const cost = [];
// The `cost` variable needs to have the following values:
// [
//   "$100 weekly",
//   "£250 monthly",
//   "€970 yearly"
// ];
```

Fix the JavaScript by parsing the HTML below.

```html
<ul>
  <li><span class="currency">$</span><span class="amount">100</span><span class="frequency">weekly</span></li>
  <li><span class="currency">£</span><span class="amount">250</span><span class="frequency">monthly</span></li>
  <li><span class="currency">€</span><span class="amount">970</span><span class="frequency">yearly</span></li>
</ul>
```

===

```js
const costs = [];
const els = document.querySelectorAll("ul li");
for (const el of els) {
  costs.push(el.textContent);
}
```

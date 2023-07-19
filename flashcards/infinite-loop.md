Avoid infinite loops with the following:

+ Make sure your loop has a {{c1::condition}} to stop it.
+ Verify {{c1::input and loop conditions}} are correct.
+ Check that {{c1::loop variables}} are being updated correctly.
+ Use {{c1::`break` or `return` statements}} to exit the loop when needed.
+ Use {{c1::debugging tools like breakpoints and console logging}} to identify and fix issues.

===

**Example 1**: While Loop with Termination Condition

```js
let count = 0;

while (count < 5) {
  console.log(count);
  count++;
}
```

In this example, the `while` loop will iterate as long as `count` is less than 5.
Once `count` reaches 5, the loop will terminate.

**Example 2**: For Loop with Correct Increment

```js
for (let i = 0; i <= 10; i += 2) {
  console.log(i);
}
```

In this `for` loop, the `i` variable is incremented by 2 in each iteration.
This ensures that `i` doesn't stay the same, preventing an infinite loop.

**Example 3**: Loop with Break Statement

```js
let num = 1;

while (true) {
  console.log(num);
  if (num === 5) {
    break;
  }
  num++;
}
```

Here, the `while` loop will continue indefinitely unless the condition `num === 5` is met.
When `num` reaches 5, the `break` statement is executed, breaking out of the loop.

**Example 4**: Recursive Function with Base Case

```js
function countdown(num) {
  if (num === 0) {
    return;
  }
  console.log(num);
  countdown(num - 1);
}

countdown(5);
```

The `countdown` function recursively counts down from a given number until it reaches the base case of `num === 0`.
Without the base case, the function would keep calling itself infinitely.

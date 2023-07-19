A constructor is just a function called using the {{c1::`new`}} keyword.
When you call a constructor, it will:

- create a new {{c1::object}}
- bind {{c1::`this`}} to the new {{c1::object}}, so you can refer to {{c1::`this`}} in your constructor code
- run the code in the constructor
- return the new {{c1::object}}.

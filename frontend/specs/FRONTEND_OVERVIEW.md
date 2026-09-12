# Calculator

We are going to make a web application for a non-scientific calculator.

## Supported operations

- Addition
- Subtraction
- Multiplication
- Division
- Exponents
- Percentage
- Square Root

## UI/UX

- We are going to have a similar UI as an iOS calculator.
- The user can press the buttons in the UI for generating the expressions
- The user can type with their keyboard the expression, however, should ignore all the non allowed characters, for example, no letters
- We should avoid the user from entering things like `***`, for that, we are always going to check if the last character is a symbol so we can replace it.
  - The only valid case is the minus because you can put things like `2*-1`
- For parenthesis operations, to avoid the user to enter things like `(((`, for every open parenthesis, we will add the closer one. And for the close, we are going to check if there is any other open operation, so is not possible to do things like `)`.
- We should use the standard symbols for each operations, for example, the UI don't need to show 'sqrt'.
- We are going to use the infix notation in the UI
- An enter should just make a request to endpoint, same as the `=` button
- We should have a `AC` button

## Validations
All the validations are going to be inside the component but just called, the logig itself should live in a different service, so is unit test easy

## Backend communication
- We are going to have just one endpoint that is `/calculate` with a POST That should include a JSON with the field `expression` with the math expression
- The result can be a 200 with a JSON with the field `result` to display, other cases such as invalid operations or non valid formula, we will have a 400 with the error message


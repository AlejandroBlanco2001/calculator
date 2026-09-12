# Calculator 
This is the backend service of a calculator that will be consumed by a React app, this will be run locally 
through a `docker-compose` file for the sake of this project.

We are just using `chi` to handle the HTTP server, take the following considerations when suggesting/edit/adding things:

1. There is no need for strict input validation (injections, malicious code), because all of the inputs are going to be math expressions.
2. All the inputs that the endpoints gets are going to be math expressions
3. We are going to use the Shunting yard algorithm for evaluating the expressions, and we are going to use Polish Reverse Notation (RPN)
4. The inputs are going to be infix notation, for example `2+5`
5. The supported operations are going to be: Addition, Subtraction, Division, Multiplications, Square Root, Percentage and Exponents
6. For things like square root, percentage and exponents the client is going to send the standard symbols.

## Operations
All the operations should be an independent function, and evaluate their errors independent of the others, we are going to use floats with 32 bits precision
for better responses. 

## Endpoint
1. ``/calculate``: This is a POST endpoint, this will get inside the body a field called 'expression', and the idea is to:
  - Make the infix to RPN
  - Evaluate the stack with the Shunting-Yard algorithm
  - return the result of the evaluation inside a JSON with the field "result" with a 200 result
  - Any other thing should be a 400 error, with the reason why: "Division by Zero", "Negative square root"

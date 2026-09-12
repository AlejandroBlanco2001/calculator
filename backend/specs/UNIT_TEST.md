# Testing 

We are going to follow the standard Go pattern for testing "TableTesting", this file will include the functional tests that are going to follow for each file.


# Test cases

## Endpoints 
This will cover the test cases for the `main.go` file that will include the logic of the endpoints (not the RPN, Shunting-Yard or operations)

### Calculate (main.go)
0. If the user sends a valid infix expression inside the JSON inside the "expression" field, should get a 200 with the result of the operation
1. If the user sends anything that don't contain the "expression" field, should get a 400
2. IF the user sends an invalid infix expression inside the JSON in the field "expression", should get a 400
3. If the user sends a valid infix expression inside the JSON in the field "expression" but the operation is not doable like division by zero, the user should get a 400

## Operations (operations.go)
For the operations, we just need to worry about the invalid cases for the:

0. Division: Division by zero, throw that error
1. Square Root: Negative square root, throw that error

## Parsing algorithms (evaluator.go)

- For the infix to RPN, we just need to validate that given a valid expression in the infix, we return the equivalent in RPN
- For the Shunting-Yard evaluator, we just need to validate the end-result given a valid and invalid RPN

The reason why this is that both algorithms are well-known so just avoid adding more tests that need it, we just need to good outcome and the most general bad outcomes 




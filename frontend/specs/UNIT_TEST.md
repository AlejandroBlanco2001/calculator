# Testing

We are going to follow the conventional TDD approach to generate our code

## Test cases

### Component testing 
All the calculator code UI will live in the App.tsx, and we need to test the following:

1. When the user presses or type an open parenthesis, it should always put a closing one
2. When the user presses or type a close parenthesis and there isn't a open parenthesis, should reject the input 
3. When the user press multiples times a symbol, should just have one. For example `****` should be just one `*`.
4. When the user presses switches between symbols, should always contain the last one pressed. For example `*/` should be just `/`

All the logic validation can be unit tested without actually mocking input validations because those will be living inside a validators file.


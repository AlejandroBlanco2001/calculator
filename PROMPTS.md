## Scaffolding of the TDD for the backend

```
We are going to start the implementation in the backend of @backend/specs/BACKEND-OVERVIEW.md, however, the first part is going to follow a TDD approach, check the @backend/specs/UNIT_TEST.md for checking the desired inputs of the functions and so on. The idea is to start from operations -> evaluator and lastly the http server.

Don't create mocks for the operations and evaluators, they are just math expressions inside a string. For main.go just create the necessary server.
```

## Scaffolding of the TDD for the frontend

``` 
We can start the same approach with the frontend, we are going to follow TDD with @../frontend/specs/UNIT_TEST.md and take into account the @../frontend/specs/FRONTEND_OVERVIEW.md, same as before, we go from the most atomic operations in this case the validators and go all the way up to the components.

The requirements can be a little bit ambiguous so before starting anything, just ask a question and we can discuss.
```

## Cleaning the UI

```
Great, I notice that the UI follows the iOS convention, however, is too small and is not a great experience for the web browser uses, can you do the following:
  1. Center the calculator and expand the button to have more space in the screen
  2. Perform a review as a web developer that is using the iOS layout as reference, but not for portability
```

## Last touch

```
Review the codebase and check if there is anything missing regarding grammar, responsiveness, not quite clear instructions, possible missing things to mention and let me know
```
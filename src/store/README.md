For Redux modules, follow these rules:

1.  MUST `export default` a function called `reducer()`
2.  MUST `export` its action creators as functions
3.  MUST have action types in the form `npm-module-or-app/reducer/ACTION_TYPE`
4.  MAY export its action types as `UPPER_SNAKE_CASE`, if an external reducer needs to listen for them, or if it is a published reusable library

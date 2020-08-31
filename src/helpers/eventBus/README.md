# EventBus
Event store implementation for React(hooks).

# Technical stack

  - React: `^16.8.0`

# Provided API(outdated)

## configureModels

```js
@param {models} object [{}]
```
The function recevies an object as a parameter(similiar to defaultState in object-store).
Conventions:
 * Each key is an event name. 
 * 2 functions will be created for each event publisher and subscriber(Example: event -> test => (publishTest, subscribeTest)).
 * All created functions will be accessible via returned value of the function in corresponding way: 
```js
{
  subscribers: [...],
  publishers: [...],
}
```
 * <subscriber> gets an argument(callback), which will fire whenever the model updates
 * <publisher> gets an argument with 2 supported types:
 ** `function` - which will receive 2 argument model's last value and the whole stack of events as an object. The return value will be used as model's next value
 ** any other - which will immediatly applied as model's next value

## useSubscription
The function is a React hook. It can receive as arguments the <subsciber> functions provided by `configureModels` function.
Values will be received by an array, with order corresponding to the provided <subsciber>-s order.
NOTE:: arguments count is not limited.

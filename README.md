Convert a nested plain JavaScript object into a normalized object without any configuration. Use this library to create { key -> value } maps.

This is especially useful for pre processing JSON responses as it keeps primitive values such as integers and strings intact.

## Installation

```
npm i --save uncover
```

## Usage

This module was created for use in Flux or Redux. If you don't use these libraries and you just want to create key maps you can scroll down for the detailed example.

An action can use this module to first normalize a nested object like so:

```js
// Actions.js
import uncover from 'uncover';

export function showBookInformation (id) {
  // do some ajax call with some dummy json library
  getJSON(`/api/books/${id}`)
  .then(json => {
    dispatch({
      type: 'RECEIVE_BOOK_INFO',
      // This is where the magic happens: the first parameter takes the nested
      // value, the second one is the name of the root type.
      entities: uncover(json, 'book')
    })
  })
}
```

Now the reducers or stores can simply check for a result before actually performing the default changes

```js
// BookReducer.js
import { toMap } from 'uncover';

// create a store or a reducer, doesn't really matter for this demo.
export function (state = {}, action) {
  // this part is performed for all types of actions, so all uncovered 'books'
  // results from any action will always be processed
  var map = toMap(action.entities, 'books');
  // merge and return the map if there was a result
  if (map) return Object.assign({}, state, map);
  // now continue the default actions
  switch (action.type) {
    default:
      return state;
  }
}
```

That's all! No further configuration needed.

For more options like parsing results, creating initial data or integration with the Immutable library you can [see this page](https://github.com/peternoordijk/uncover-js/wiki/Advanced-usage-with-Flux---Redux).

## Detailed example

Let's start with our nested value

```js
// var uncover = require('uncover').default;
import uncover from 'uncover';

var results = uncover({
   "id": 1,
   "name": "Jungle Book",
   "keywords": [
      "test",
      "..."
   ],
   "animals": [
      {
         "id": 1,
         "bookId": 1,
         "name": "Bear",
         "character": {
            "id": 1,
            "animalId": 1,
            "name": "Baloo"
         }
      },
      {
         "id": 2,
         "bookId": 1,
         "name": "Wolf",
         "characters": [
            {
               "id": 2,
               "animalId": 2,
               "name": "Akela"
            },
            {
               "id": 3,
               "animalId": 2,
               "name": "Rama"
            }
         ]
      }
   ]
}, "book");

```

After calling the ```uncover``` function the value of ```results``` will be:

```js
{
   "books": [
      {
         "id": 1,
         "name": "Jungle Book",
         "keywords": [
            "test",
            "..."
         ]
      }
   ],
   "animals": [
      {
         "id": 1,
         "bookId": 1,
         "name": "Bear"
      },
      {
         "id": 2,
         "bookId": 1,
         "name": "Wolf"
      }
   ],
   "characters": [
      {
         "id": 1,
         "animalId": 1,
         "name": "Baloo"
      },
      {
         "id": 2,
         "animalId": 2,
         "name": "Akela"
      },
      {
         "id": 3,
         "animalId": 2,
         "name": "Rama"
      }
   ]
}
```

Let's process this result further to get a { key -> value } map of the characters

```js
// var toMap = require('uncover').toMap;
import { toMap } from 'uncover';

results = toMap(results, 'characters',
  // this argument is optional, in here we show the default
  // function mapping the values by 'id'. If this function returns an object
  // then this object will override the current map
  (map, item) => {
    map[item.id] = item
  },
  // this argument is also optional, this object is the map on which the
  // items will be applied to. If this is a function, the function will be
  // called and the result will be used as map.
  {}
)

```

The value ```results``` now contains the following map:

```js
{
   "1": {
      "id": 1,
      "animalId": 1,
      "name": "Baloo"
   },
   "2": {
      "id": 2,
      "animalId": 2,
      "name": "Akela"
   },
   "3": {
      "id": 3,
      "animalId": 2,
      "name": "Rama"
   }
}
```

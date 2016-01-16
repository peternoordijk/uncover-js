Convert a nested plain JavaScript object into a normalized object without any configuration. Use this library to create { key -> value } maps.

This is especially useful for pre processing JSON responses as it keeps primitive values such as ids intact.

## Purpose

This module was created for use in Flux or Redux. An action can for example use this module to first normalize a nested object like so:

```js
// Actions.js
import uncover from 'uncover';

export function showBookInformation (id) {
  // do some ajax call with some dummy json library
  getJSON(`/api/books/${id}`)
  .then(json => {
    dispatch({
      type: 'RECEIVE_BOOK_INFO', // this not required for this demo
      entities: uncover(json)
    })
  })
}
```

```js
// BookReducer.js
import { toMap } from 'uncover';

// create a store or a reducer, doesn't really matter for this demo
function reduce (state, action) {
  // perform this part for all types of actions
  var map = toMap(action.entities, 'books');
  if (map) return map;
  // now continue the default actions
  switch (action.type) {
    case 'SOME_ACTION':
      // do something else
      return state;
    default:
      return state;
  }
}


// CharacterReducer.js
import { toMap } from 'uncover';

// same idea
function reduce (state, action) {
  // we can catch the results from the same action as we only check for the
  // entities attribute
  var map = toMap(action.entities, 'characters');
  if (map) return map;
  // now continue the default actions
  switch (action.type) {
    default:
      return state;
  }
}
```

## Example

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
         "name": "Beer",
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

Value of results is now:

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
         "name": "Beer"
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
  // function mapping the values by 'id'
  (map, item) => {
    map[item.id] = item
  }
)

```

Results now contains the following map:

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

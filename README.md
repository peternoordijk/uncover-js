Convert a nested plain JavaScript object into a normalized object without any configuration. Use this library to create { key -> value } maps.

This is especially useful for pre processing JSON responses as it keeps primitive values such as ids intact.

## Usage

This module was created for use in Flux or Redux. If you don't use these libraries and you just want to create key maps you can scroll down for the example.

An action can use this module to first normalize a nested object like so:

```js
// Actions.js
import uncover from 'uncover';

export function showBookInformation (id) {
  // do some ajax call with some dummy json library
  getJSON(`/api/books/${id}`)
  .then(json => {
    dispatch({
      type: 'RECEIVE_BOOK_INFO', // this not required for this demo
      entities: uncover(json, 'book')
    })
  })
}
```

Now the reducers or stores can simply check for a result before actually performing the default changes

```js
// BookReducer.js
import { toMap } from 'uncover';
import Immutable from 'immutable';

// create a store or a reducer, doesn't really matter for this demo. In here we
// use immutable to create a map which is easy to merge, but of course you can
// also use a plain JavaScript object
function reduce (state = Immutable.Map(), action) {
  // this part is performed for all types of actions
  var map = toMap(action.entities, 'books');
  // merge and return the map if there was a result
  if (map) return state.merge(map);
  // now continue the default actions
  switch (action.type) {
    default:
      return state;
  }
}
```

That's all! No further configuration needed. However, if you want to change the functionality, for example to parse each item before adding them to your store, you can change the default behavior like so:

```js
// CharacterReducer.js
import { toMap } from 'uncover';
import Immutable from 'immutable';
import Character from './Character';

// same idea
function reduce (state = Immutable.Map(), action) {
  // we can catch the results from the same action as we only check for the
  // entities attribute.
  var map = toMap(action.entities, 'characters',
    // add a custom mapping function
    (map, item) => map.set(item.id, new Character(item)),
    // supply an object to use as map
    Immutable.Map()
  );
  if (map) return state.merge(map);
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

Value of ```results``` is now:

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
  // function mapping the values by 'id'. If this function returns an object
  // then this object will override the current map
  (map, item) => {
    map[item.id] = item
  },
  // this argument is also optional, this object is the map on which the
  // items will be applied to
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

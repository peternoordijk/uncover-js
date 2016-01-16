Convert a nested plain JavaScript object into a normalized object containing lists of entities without any configuration.

This is especially useful for pre processing JSON responses as it keeps primitive values such as ids intact.

## Example

In:

```js
// ES6 module loaders are supported as well
var uncover = require('uncover');

uncover({
   "name": "Jungle Book",
   "keywords": [
      "test",
      "..."
   ],
   "animals": [
      {
         "name": "Beer",
         "character": {
            "name": "Baloo"
         }
      },
      {
         "name": "Wolf",
         "characters": [
            {
               "name": "Akela"
            },
            {
               "name": "Rama"
            }
         ]
      }
   ]
}, "book");

```

Out:

```js
{
   "books": [
      {
         "name": "Jungle Book",
         "keywords": [
            "test",
            "..."
         ]
      }
   ],
   "animals": [
      {
         "name": "Beer"
      },
      {
         "name": "Wolf"
      }
   ],
   "characters": [
      {
         "name": "Baloo"
      },
      {
         "name": "Akela"
      },
      {
         "name": "Rama"
      }
   ]
}
```

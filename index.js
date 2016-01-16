'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.toMap = toMap;
var pluralize = require('pluralize');

/**
 * Uncover the given plain JS object, normalizing nested values
 * @param  {Array|object} body    A nested object or array. Example: {"name":"Jungle Book","keywords":["test","..."],"animals":[{"name":"Beer","character":{"name":"Baloo"}},{"name":"Wolf","characters":[{"name":"Akela"},{"name":"Rama"}]}]}
 * @param  {String} name   The name which you want to call the root object. Example: "book"
 * @return {Object}        An object containing arrays with unnested values. Example: {"books":[{"name":"Jungle Book","keywords":["test","..."]}],"animals":[{"name":"Beer"},{"name":"Wolf"}],"characters":[{"name":"Baloo"},{"name":"Akela"},{"name":"Rama"}]}
 */

exports['default'] = function (body, name) {
  if (!name) throw new Error('You should provide a name as second argument to the uncover function, representing the root object');
  return uncover(body, name, {});
};

/**
 * A flexible way to convert the uncovered results into a { key -> value } map
 * @param  {object} entities uncovered entities containing arrays with values. A falsy value will make this function return null
 * @param  {string} name     the attribute of the entities which we want to map
 * @param  {function} mapper   a function to put the items into the map. Defaults to (map, item) => {map[item.id] = item}
 * @return {object}          a { key -> value } map
 */

function toMap(entities, name) {
  var mapper = arguments.length <= 2 || arguments[2] === undefined ? function (map, item) {
    map[item.id] = item;
  } : arguments[2];

  // validate input
  if (!entities) return null;
  if (!name) throw new Error('You should provide a name of the entities you want to convert when calling the toMap function');
  var results = entities[name];
  if (!results) return null;

  // create the map
  results = results.reduce(function (map, current) {
    mapper(map, current);
    return map;
  }, {});
  return results;
}

// Recursive function
function uncover(body, name, tables) {

  // set the value to an array, and the name to a plural version
  if (body.constructor !== Array) {
    body = [body];
    name = pluralize(name);
  }
  // get or create an array representing an entity
  if (!tables[name]) tables[name] = [];
  var table = tables[name];

  // iterate through the given objects
  for (var i = 0; i < body.length; i++) {
    var obj = body[i];
    // this will be the object representing the given object without its nested references
    var result = {};
    // Iterate through its attributes
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        var val = obj[attr];

        // Objects are always nested objects
        if (val.constructor === Object) {
          uncover(val, attr, tables);
          // Arrays might contain numbers or strings instead of nested objects
        } else if (val.constructor === Array) {
            if (val.length) {
              if (val[0].constructor === Object) {
                uncover(val, attr, tables);
              } else {
                result[attr] = val;
              }
              // if the array is empty it could be meant to filled with nested objects or primitive values, so we handle this value as being both
            } else {
                if (!tables[attr]) tables[attr] = [];
                result[attr] = val;
              }
            // this attribute is a string or integer
          } else {
              result[attr] = val;
            }
      }
    }
    // add the stripped object to the result
    table.push(result);
  }
  return tables;
};

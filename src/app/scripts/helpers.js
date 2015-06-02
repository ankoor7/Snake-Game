"use strict";

function addVector(a,b) {
  return [ a[0]+b[0],  a[1]+b[1] ];
}

function subtractVector (a, b) {
  return [ a[0]-b[0],  a[1]-b[1] ];
}

function isCoord (coord) {
  return (_.isArray(coord) && coord.length === 2 && _.isNumber(coord[0]) && _.isNumber(coord[1]) )
}
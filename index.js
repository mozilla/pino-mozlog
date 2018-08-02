#!/usr/bin/env node

const pump = require('pump');
const split = require('split2');
const through = require('through2');

const {
  createParseFunction,
  createTransformFunction,
  parseOptions,
} = require('./src/index');

const options = parseOptions(process.argv.slice(2));
const mozlogTransport = through.obj(createTransformFunction({ options }));

pump(process.stdin, split(createParseFunction({ options })), mozlogTransport);

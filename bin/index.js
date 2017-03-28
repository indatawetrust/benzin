#!/usr/bin/env node

var program = require('commander'),
    path = require('path'),
    generate = require('../lib')
 
program
  .version('0.0.1')

program.command('up')
  .action(function () {
  
  })

program.command('down')
  .action(function () {

  })

program.command('restart')
  .action(function () {

  })

program.parse(process.argv);

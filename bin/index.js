#!/usr/bin/env node

var program = require('commander'),
    path = require('path'),
    fs = require('fs'),
    exec = require('child_process').exec,
    execFile = require('child_process').execFile,
    fse = require('fs-extra'),
    spawn = require('child_process').spawn,
    supertest = require('supertest'),
    ora = require('ora');

program
  .version('0.0.2')
  .command('init')
  .action(function () {

    try {
    
      fs.statSync(path.join(process.cwd(), 'benzin.json'))

      const benzin = require(path.join(process.cwd(), 'benzin.json'))

      const request = supertest('http://localhost:3000')

      fse.copySync(path.join(__dirname, '../lib'), process.cwd())
      
      const compose = spawn('docker-compose', ['run', '-d', '--service-ports', '--name', benzin.container_name, 'api'])

      compose.stderr.on('data', function (data) {
        console.log(data.toString())
      })

      compose.on('exit', function (data) {
        
        ora('please wait..').start()
 
        const interval = setInterval(function () {
          request.get('/').then(res => {
            console.log('\n\napi created ✅  ~> http://localhost:3000!')
            clearInterval(interval)
            process.exit()
          }).catch(err => {
             
          })
        }, 1000)

      })

    
    } catch (e) {
    
      console.log("benzin.json does not exist.")

    }

  })

program
  .command('test')
  .action(function () {

    const test = spawn('npm', ['test'], {
      cwd: __dirname 
    })

    test.stdout.on('data', function (data) {
      console.log(data.toString())
    })

    test.stderr.on('data', function (data) {
      console.log(data.toString())
    })

    test.on('exit', function (data) {

    })

  })

program.parse(process.argv)

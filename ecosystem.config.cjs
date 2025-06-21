module.exports = {
    apps: [
      {
        name: 'Mucholink Trucking',
        port: '2013',
        exec_mode: 'cluster',
        instances: '1',
        script: './.output/server/index.mjs' 
      }
    ]
  }
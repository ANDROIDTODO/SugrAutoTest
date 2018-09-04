/* eslint-disable no-undef */
const net = require('net')
let mWebContents = null;



function socketmanager () {

}

socketmanager.initMainProcess =  (mainProcess) => {

  const server = net.createServer((socket) => {
    console.log('connect: ' +
      socket.remoteAddress + ':' + socket.remotePort)

    socket.on('data', (data) => {
      mWebContents.send('socket-message', data)
      console.log('client send:' + data)
    })

    socket.on('close', (data) => {
      console.log('client closed!')
      mWebContents.send('socket-close', data)
      // socket.remoteAddress + ' ' + socket.remotePort);
    })
  }).on('error', (err) => {
    // handle errors here
    throw err
  })

// grab an arbitrary unused port.
  server.listen({
    host: 'localhost',
    port: 9201,
    exclusive: true
  }, () => {
    console.log('opened server on', server.address())
  })


  mWebContents = mainProcess.webContents;
}

module.exports = socketmanager;
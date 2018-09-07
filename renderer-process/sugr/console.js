const {ipcRenderer} = require('electron')

const recodeText = document.getElementById('runtimeRecord')
let consoleText = '';

let isScollToBottom = true;

ipcRenderer.on('console-event', (event, text) => {
  if (text != undefined){
    let append = '<p>'+text+'</p>'
    consoleText += append
    recodeText.innerHTML = consoleText
  }

})

ipcRenderer.on('socket-message', (event, text) => {
  if (text != undefined) {
    let append = '<p>'+text+'</p>'
    consoleText += append
    recodeText.innerHTML = consoleText
  }
})

function sc () {

}
const {ipcRenderer} = require('electron')
const moment = require('moment');

const recodeText = document.getElementById('runtimeRecord')
let consoleText = '';

let isScollToBottom = true;

ipcRenderer.on('console-event', (event, level, text) => {
    let append
    let time = moment().format('YYYY-MM-DD HH:mm:ss')
    if (level === 'error') {
        append = '<p style="color: red">[' + time + ']: ' + text + '</p>'
    } else if (level === 'info'){
        append = '<p style="color: steelblue">[' + time + ']: ' + text + '</p>'
    } else {
        append = '<p>[' + time + ']: ' + text + '</p>'
    }
    consoleText += append
    recodeText.innerHTML = consoleText

})

ipcRenderer.on('socket-message', (event, level, text) => {
    if (text != undefined) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        let append
        if (level === 'error') {
            append = '<p style="color: red">[' + time + ']: ' + text + '</p>'
        } else if (level === 'info'){
            append = '<p style="color: steelblue">[' + time + ']: ' + text + '</p>'
        } else {
            append = '<p>[' + time + ']: ' + text + '</p>'
        }
        consoleText += append
        recodeText.innerHTML = consoleText
    }
})

function sc() {

}
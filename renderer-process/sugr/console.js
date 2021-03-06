const {ipcRenderer} = require('electron')
const moment = require('moment');

const recodeText = document.getElementById('runtimeRecord')
let consoleText = '';

let isScollToBottom = true;


ipcRenderer.on('console-scroll-controller',(event,_isScollToBottom) =>{
    console.log('current console scroll status :' + _isScollToBottom)
    isScollToBottom = _isScollToBottom
})

ipcRenderer.on('console-event', (event, level, text) => {

    var div = document.getElementById('runtimeRecord');
    let append
    let time = moment().format('YYYY-MM-DD HH:mm:ss')
    if (level === 'error') {
        append = '<p style="color: red">[' + time + ']: ' + text + '</p>'
    } else if (level === 'info'){
        append = '<p style="color: steelblue">[' + time + ']: ' + text + '</p>'
    } else if (level === 'result'){
        append = '<p style="color: #dd1144">[' + time + ']: ' + text + '</p>'
    } else {
        append = '<p>[' + time + ']: ' + text + '</p>'
    }

    consoleText += append
    div.innerHTML = consoleText
    if(isScollToBottom){
        div.scrollTop = div.scrollHeight
    }



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



ipcRenderer.on('console-event-json', (event, level, text) => {
    if (text != undefined) {
        // let time = moment().format('YYYY-MM-DD HH:mm:ss')
        // let append
        // if (level === 'error') {
        //     append = '<p style="color: red">[' + time + ']: ' + syntaxHighlight(text) + '</p>'
        // } else if (level === 'info'){
        //     append = '<p style="color: steelblue">[' + time + ']: ' + syntaxHighlight(text) + '</p>'
        // } else {
        //     append = '<p>[' + time + ']: ' +syntaxHighlight(text) + '</p>'
        // }
        // consoleText += append

        recodeText.innerHTML = syntaxHighlight(text)
    }
})

ipcRenderer.on('console-clear-log',(event) =>{
    recodeText.innerHTML = ''
})



function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}


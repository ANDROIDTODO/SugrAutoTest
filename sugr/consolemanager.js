const {ipcMain} = require('electron')

ipcMain.on('console-manager-event', (event,text) => {
    let result = text
    event.sender.send('console-event', result)
})

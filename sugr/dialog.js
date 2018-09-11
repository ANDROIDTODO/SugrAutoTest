/**
 * Created by Jeromeyang on 2018/9/11.
 */
const {ipcMain,dialog} = require('electron')

ipcMain.on('show-error-dialog',(event,title,message) => {
    dialog.showErrorBox(title, message)
})
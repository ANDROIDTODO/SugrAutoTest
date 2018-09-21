/* eslint-disable no-multiple-empty-lines,no-trailing-spaces */
// only add update server if it's not being run from cli
if (require.main !== module) {
    require('update-electron-app')({
        logger: require('electron-log')
    })
}




const path = require('path')
const glob = require('glob')
const {app, BrowserWindow} = require('electron')
const net = require('net')
const socketm = require(path.join(__dirname, 'sugr/socketmanager.js'))


if (process.mas) app.setName('Sugr Alexa')
const debug = /--debug/.test(process.argv[2])

let mainWindow = null

function initSocket() {
    const server = net.createServer((socket) => {
        console.log('connect: ' +
            socket.remoteAddress + ':' + socket.remotePort)

        socket.on('data', (data) => {
            mainWindow.webContents.send('socket-message', data)
            console.log('client send:' + data)
        })

        socket.on('close', (data) => {
            console.log('client closed!')
            mainWindow.webContents.send('socket-close', data)
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
}

function initialize() {
    const shouldQuit = makeSingleInstance()
    if (shouldQuit) return app.quit()

    loadDemos()

    function createWindow() {
        const windowOptions = {
            width: 1080,
            minWidth: 680,
            height: 840,
            title: app.getName()
        }

        if (process.platform === 'linux') {
            windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
        }

        if (process.platform === 'windows'){

        }

        mainWindow = new BrowserWindow(windowOptions)
        mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

        // Launch fullscreen with DevTools open, usage: npm run debug
        if (debug) {
            mainWindow.webContents.openDevTools()
            mainWindow.maximize()
            require('devtron').install()
        }

        mainWindow.on('closed', () => {
            mainWindow = null
        })

        socketm.initMainProcess(mainWindow)
    }

    app.on('ready', () => {
        createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow()
        }
    })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
    if (process.mas) return false

    return app.makeSingleInstance(() => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}

// Require each JS file in the main-process dir
function loadDemos() {
    // const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
    // files.forEach((file) => {
    //   console.log('require file path:' + file)
    //   require(file)
    // })

    require(path.join(__dirname, 'sugr/consolemanager.js'));
    require(path.join(__dirname, 'sugr/main.js'));
    require(path.join(__dirname, 'sugr/dialog.js'));
    require(path.join(__dirname, 'sugr/open-file.js'));
}

initialize()
// initSocket()

// 负责调度所有模块
// 与界面通信通过IPC
// 规则流程:  1.点击开始后,判断选择的状态,若有错误给出提示后重新选择,若无则将根据选择播放第一条的语料

const {ipcMain} = require('electron')

//播报控件
const player = require('./audio-speak')
//邮件控件
const emailer = require('./emails-service')
//浏览器driver
const browersDriver = require('./alexa-chrome-driver')



let currentUtteranceIndex = 0
let isNeedSilence = false
let isNeedKitchen = false
let isNeedMusic = false
let isNeedPlayback = false

let position_330 = false
let position_390 = false
let position_930 = false
let position_990 = false

let deviceSerialNumber

let currentLanguage

let isDeviceUnderControll = false

let isLogin = false;

/// *************************IpcMain************************
ipcMain.on('start-click',(event) => {
    browersDriver.openBrowser('https://alexa.amazon.com/',(r) => {
        console.log(r)

        if (r == 1) {
            event.sender.send('console-event','debug','亚马逊登录成功!')
            event.sender.send('alexa-login-event',1)
        }else if (r == 2) {
            event.sender.send('console-event','error','网页被关闭!')
            event.sender.send('alexa-login-event',2)
        }else if (r == 3){
            event.sender.send('console-event','debug','登录界面已打开!')
        }
    })
})


/// *************************IpcMain************************







let sugrtestMain = {

    init: function () {


    }
}



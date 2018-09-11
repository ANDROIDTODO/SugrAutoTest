// 负责调度所有模块
// 与界面通信通过IPC
// 规则流程:  1.点击开始后,判断选择的状态,若有错误给出提示后重新选择,若无则将根据选择播放第一条的语料
//登录的账号密码可以写在config中
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
ipcMain.on('alexa-login-click',(event) => {
    browersDriver.openBrowser('https://alexa.amazon.com/',(code,result) => {
        console.log(code)

        if (code == 1) {
            event.sender.send('console-event','debug','亚马逊登录成功!')
            event.sender.send('alexa-login-event',1)
        }else if (code == 2) {
            event.sender.send('console-event','error','网页被关闭!')
            event.sender.send('alexa-login-event',2)
        }else if (code == 3){
            event.sender.send('console-event','debug','登录界面已打开!')
        }else if (code == 4){
            event.sender.send('console-event','debug','准备初始化...')
            event.sender.send('console-event','debug','正在获取在线设备信息...')
        }else if (code == 5){ //获取到了device online list
            if (result.length === 0){
                event.sender.send('console-event','error','当前无在线设备,请点击SN列表选项中的确定刷新在线设备列表')
                event.sender.send('alexa-no-devices',true)
            }else {
              event.sender.send('alexa-no-devices',false)
              event.sender.send('console-event','info',JSON.stringify(result))
            }
        }
    })
})

ipcMain.on('start-test-click',(event,data) => {

})

ipcMain.on('refresh-devices-click',(event) => {

})


ipcMain.on('confirm-device-sn',(event,sn) => {
    console.log('confirm-device-sn click')
    deviceSerialNumber = sn
})



/// *************************IpcMain************************







let sugrtestMain = {

    init: function () {


    }
}



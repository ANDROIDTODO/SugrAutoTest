// 负责调度所有模块
// 与界面通信通过IPC
// 规则流程:  1.点击开始后,判断选择的状态,若有错误给出提示后重新选择,若无则将根据选择播放第一条的语料
//登录的账号密码可以写在config中
const {ipcMain,dialog,BrowserWindow} = require('electron')
const settings = require('electron-settings')
const path = require('path')
//播报控件
const player = require('./audio-speak')
player.init()
//邮件控件
const mailer = require('./emails-service')
//浏览器driver
const browersDriver = require('./alexa-chrome-driver')
// api-parser
const apiParser = require('./api-parser')

const judge = require('./judgement-service')

const controller = require('./p-controller')

player.setPlayerPath(settings.get('playerPath'))
console.log(settings.get('playerPath'))

controller.setCacheDir(settings.get('cacheDir'))

//xlsx
const xlsx = require('./excelmanager')


controller.initialize(browersDriver,player,judge,mailer,apiParser,xlsx)

let deviceSerialNumber

let todolistId

let currentLanguage = 'en'

browersDriver.setLanguage(currentLanguage)

/// *************************IpcMain************************
ipcMain.on('alexa-login-click',(event) => {

    // browersDriver.ap_email = "jeromeyang@sugrsugr.com"
    // browersDriver.ap_password = "jeromeyang@520"


    browersDriver.openBrowser((code,result) => {
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
              event.sender.send('console-event','info',JSON.stringify(result,null,'\t'))
            }
        }else if (code == 6){
            todolistId = result
            controller.setTodoListId(result)
            console.log('todolistId:'+todolistId)
        }else if (code == 7){
            event.sender.send('console-event','debug','正在登录...')
        }else if (code == 8){
            event.sender.send('console-event','debug','请在网页中输入验证码！！！')
        }else if (code == 9){
          event.sender.send('console-event','debug','登录界面请求超时,刷新后重试！！！')
        }
    })
})

ipcMain.on('clear-log-click',(event)=>{
    event.sender.send('console-clear-log')
    

})

ipcMain.on('start-test-click',(event,data) => {



    if (deviceSerialNumber == null || deviceSerialNumber == ''){

        //let xlsxPath1 = path.join(__dirname,'../assets/config/sat_config.xlsx');
        //event.sender.send('console-event','debug',xlsxPath1)
        dialog.showErrorBox('错误', '请填写有效完整的序列号后确认！再点击开始')
    }else {

        event.sender.send('start-test-response')

        //if(!isstart){
        //    isstart =  true

            controller.startTest(data,event.sender)
        //}else {
        //   judge.judge(0,'en',function (_data) {
        //        event.sender.send('console-event','debug',JSON.stringify(_data,null,'\t'))
        //    })
        //}



        // 获取history中最近的一个item （creationTimestamp） //是否被唤醒
    }


})

ipcMain.on('refresh-devices-click',(event) => {

})


ipcMain.on('resume-test',(event) => {
    controller.resume()
    event.sender.send('start-test-response')
})

ipcMain.on('stop-test',(event) => {
    controller.pause()
    controller.reset()
    event.sender.send('stop-test-response')
})

ipcMain.on('pause-test',(event) => {
    controller.pause()
    event.sender.send('pause-test-response')
})

ipcMain.on('end-test',(event) => {
    controller.pause()
    controller.reset()
    event.sender.send('stop-test-response')
})

ipcMain.on('reset-click',(event) => {

})


ipcMain.on('confirm-device-sn',(event,sn) => {
    console.log('confirm-device-sn click')
    deviceSerialNumber = sn
    controller.setSN(sn)
    console.log("deviceSerialNumber:"+deviceSerialNumber)
})


ipcMain.on('choice-player', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, (files) => {
    if (files) {
      let playerPath = files[0]
      console.log(playerPath)
      settings.set('playerPath',playerPath)
      player.setPlayerPath(playerPath)
      event.sender.send('player-path-response',playerPath)
    }
  })
})


ipcMain.on('choice-cache-dir', (event) => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, (files) => {
        console.log(files)
        if (files) {
            let cacheDir = files[0]
            console.log(cacheDir)
            settings.set('cacheDir',cacheDir)
            controller.setCacheDir(cacheDir)
            event.sender.send('cache-dir-response',cacheDir)
        }
    })
})

ipcMain.on('switch-scroll',(event,_sc) =>{
    event.sender.send('console-scroll-controller',_sc)
})

ipcMain.on('notify-language',(event,_l) =>{
    currentLanguage = _l
    browersDriver.setLanguage(currentLanguage)
    console.log(_l)
})

ipcMain.on('get-cache-dir',(event)=>{
    event.sender.send('cache-dir-response',settings.get('cacheDir'))
})

ipcMain.on('get-player-path',(event)=>{
    console.log('get-player-path')
    event.sender.send('player-path-response',settings.get('playerPath'))
})



/// *************************IpcMain************************










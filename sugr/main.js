// 负责调度所有模块
// 与界面通信通过IPC
// 规则流程:  1.点击开始后,判断选择的状态,若有错误给出提示后重新选择,若无则将根据选择播放第一条的语料
//登录的账号密码可以写在config中
const {ipcMain,dialog} = require('electron')
const path = require('path')
//播报控件
const player = require('./audio-speak')
//邮件控件
const emailer = require('./emails-service')
//浏览器driver
const browersDriver = require('./alexa-chrome-driver')
// api-parser
const apiParser = require('./api-parser')

const judge = require('./judgement-service')

const controller = require('./p-controller')


//xlsx
const xlsx = require('./excelmanager')
let xlsxPath = path.join(__dirname,'../assets/config/sat_config.xlsx');
xlsx.initialize(xlsxPath,null,null)


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

let todolistId

let isstart = false



/// *************************IpcMain************************
ipcMain.on('alexa-login-click',(event) => {

    browersDriver.ap_email = "jeromeyang@sugrsugr.com"
    browersDriver.ap_password = "jeromeyang520@"

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
              event.sender.send('console-event','info',JSON.stringify(result,null,'\t'))
            }
        }else if (code == 6){
            todolistId = result
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

ipcMain.on('start-test-click',(event,data) => {



    if (deviceSerialNumber == null || deviceSerialNumber == ''){

        let xlsxPath1 = path.join(__dirname,'../assets/config/sat_config.xlsx');
        event.sender.send('console-event','debug',xlsxPath1)
        dialog.showErrorBox('错误', '请填写有效完整的序列号后确认！再点击开始')
    }else {

        if(!isstart){
            isstart =  true
            apiParser.setSender(event.sender,deviceSerialNumber)
            judge.init(browersDriver,apiParser,todolistId)
            //根据sn获取当前最新的card的creationTimestamp
            browersDriver.getCardList((_data) => {
                apiParser.parseCardData(_data)
                // 获取当前itemId最近一个的todo item（updatedDateTime，value）
                browersDriver.getTODOList(todolistId,(_data) => {
                    apiParser.parseTodoList(_data)
                    browersDriver.getHistory(_data => {
                        apiParser.parseHistory(_data)
                    })
                })
            })
        }else {
            judge.judge(0,'en',function (_data) {
                event.sender.send('console-event','debug',JSON.stringify(_data,null,'\t'))
            })
        }



        // 获取history中最近的一个item （creationTimestamp） //是否被唤醒
    }


})

ipcMain.on('refresh-devices-click',(event) => {

})

ipcMain.on('stop-click',(event) => {

})

ipcMain.on('reset-click',(event) => {

})


ipcMain.on('confirm-device-sn',(event,sn) => {
    console.log('confirm-device-sn click')
    deviceSerialNumber = sn
    console.log("deviceSerialNumber:"+deviceSerialNumber)
})



/// *************************IpcMain************************










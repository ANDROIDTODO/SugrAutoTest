// 负责调度所有模块
// 与界面通信通过IPC
// 规则流程:  1.点击开始后,判断选择的状态,若有错误给出提示后重新选择,若无则将根据选择播放第一条的语料
//登录的账号密码可以写在config中
const {ipcMain,dialog} = require('electron')

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

let todolistId

let lastestCardCreateTime = -1

let lastestHistoryCreateTime = -1

let lastestTodoItemCreateTime = -1

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
              event.sender.send('console-event','info',JSON.stringify(result,null,'\t'))
            }
        }else if (code == 6){
            todolistId = result
            console.log('todolistId:'+todolistId)
        }else if (code == 7){
            event.sender.send('console-event','debug','正在登录...')
        }else if (code == 8){
            event.sender.send('console-event','debug','请在网页中输入验证码！！！')
        }
    })
})

ipcMain.on('start-test-click',(event,data) => {

    if (deviceSerialNumber == null || deviceSerialNumber == ''){
        dialog.showErrorBox('错误', '请填写有效完整的序列号后确认！再点击开始')
    }else {
        //根据sn获取当前最新的card的creationTimestamp
        browersDriver.getCardList((_data) => {
            parseCardData(_data,event)
            // 获取当前itemId最近一个的todo item（updatedDateTime，value）
            browersDriver.getTODOList(todolistId,(_data) => {
                parseTodoList(_data,event)
                browersDriver.getHistory(_data => {
                    parseHistory(_data,event)
                })
            })
        })


        // 获取history中最近的一个item （creationTimestamp） //是否被唤醒
    }


})

ipcMain.on('refresh-devices-click',(event) => {

})


ipcMain.on('confirm-device-sn',(event,sn) => {
    console.log('confirm-device-sn click')
    deviceSerialNumber = sn
    console.log("deviceSerialNumber:"+deviceSerialNumber)
})



/// *************************IpcMain************************


function parseCardData(_data,event) {
    let data = JSON.parse(_data)
    let cards = data.cards
    if (cards.length > 0){
        try{
            cards.forEach(v => {
                console.log('test1')
                //TODO 若没有发现则取第一个作为基准
                if (v.sourceDevice.serialNumber == deviceSerialNumber) {
                    let heard
                    let answer = ''
                    let time
                    let serialNumber
                    console.log('test2')

                    if(v.playbackAudioAction != null){
                        heard = v.playbackAudioAction.mainText
                    }
                    console.log('test3')

                    if(v.descriptiveText!=null){
                        answer = v.descriptiveText[0]
                    }
                    time = v.creationTimestamp
                    serialNumber = v.sourceDevice.serialNumber
                    console.log('test4')

                    let _card = {
                        heard,
                        answer,
                        time,
                        serialNumber
                    }
                    console.log('test5')

                    console.log(_card)
                    event.sender.send('console-event','info',JSON.stringify(_card))
                    throw new Error('break')
                }

            })
        }catch (e){
            console.log(e.message)
        }

    }
}

function parseTodoList(_data,event) {
    let data = JSON.parse(_data)
    let list = data.list


    if (list.length > 0){

        let time = list[0].createdDateTime
        let value = list[0].value

        let _todo = {
            value,
            time
        }

        console.log(_todo)
        event.sender.send('console-event','info',JSON.stringify(_todo))
    }
}

function parseHistory(_data,event) {
    let data = JSON.parse(_data)
    let activities = data.activities


    if (activities.length > 0){

        if(lastestHistoryCreateTime == -1){ //只需要获取第一个
            let time = ''
            let serialNumber = ''
            let summary = ''
            let toDoId = ''
            let value = ''

            time = activities[0].creationTimestamp
            serialNumber = activities[0].sourceDeviceIds[0].serialNumber
            summary = activities[0].description.summary

            if(activities[0].domainAttributes != null){
                try {
                    toDoId = activities[0].domainAttributes.toDoId
                    value = activities[0].domainAttributes.value
                }catch (e){

                }
            }

            let _history = {
                time,
                serialNumber,
                summary,
                toDoId,
                value
            }

            event.sender.send('console-event','info',JSON.stringify(_history))
        }else { //需要将所有大于当前时间值的存储下来

        }
        // event.sender.send('console-event','info',JSON.stringify(_todo))
    }
}







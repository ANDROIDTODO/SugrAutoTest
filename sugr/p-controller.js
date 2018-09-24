/**
 * Created by Jeromeyang on 2018/9/12.
 */

/**
 * 规则是先切换场景，再切换位置，再切换语言
 */
let browersDriver
let player
let judge
let emailer
let apiParser
let xlsx


let currentUtteranceIndex = 11


let deviceSerialNumber = null

let currentLanguage = -1
let currentPosition = -1
let currentSense = -1
let allLanguage = []
let position = []
let sense = []

let isDeviceUnderControll = false

let todolistId = null

let sender

let timer

let networkTimer


function controller() {

}

controller.initialize = function (_browersDriver, _player, _judge, _emailer, _apiParser,_xlsx) {
    browersDriver = _browersDriver
    player = _player
    judge = _judge
    emailer = _emailer
    apiParser = _apiParser
    xlsx = _xlsx
    judge.setXlsx(xlsx)
}

controller.a = function () {

}

function startWithGetLastestData(f) {


    //根据sn获取当前最新的card的creationTimestamp
    browersDriver.getCardList((_data) => {
        apiParser.parseCardData(_data)
        // 获取当前itemId最近一个的todo item（updatedDateTime，value）
        browersDriver.getTODOList(todolistId,(_data) => {
            apiParser.parseTodoList(_data)
            browersDriver.getHistory(_data => {
                apiParser.parseHistory(_data)
                if(f!=null){
                    f()
                }

            })
        })
    })
}

controller.setSN = function (_sn) {
    deviceSerialNumber = _sn
}

controller.setTodoListId = function (_id) {
    todolistId  = _id
    //
}

controller.startTest = function (config,_sender) {
    sender = _sender
    apiParser.setSender(_sender,deviceSerialNumber)
    judge.init(browersDriver,apiParser,todolistId)
    start(config)

}


function start(config) {
    //做配置的解析
    position = config.position

    // _positions.forEach((value) =>{
    //     //暂时只支持990
    //     if (value == '990'){
    //         position_990 = true
    //     }
    //
    // })




    sense = config.sense_list
    // _sense_list.forEach(value =>{
    //     //暂时支支持silence
    //     if (value == 'silence'){
    //         isNeedSilence = true
    //     }
    // })

    currentLanguage = 0
    currentPosition = 0
    currentSense = 0
    allLanguage  = config.language

    next()
}

function next(){

    currentUtteranceIndex++
    console.log("currentUtteranceIndex:"+ currentUtteranceIndex)
    startWithGetLastestData(function () {

        // player
        sender.send('console-event','debug',"语言："+allLanguage[currentLanguage]+"-位置：" +position[currentPosition]
            +"-场景"+sense[currentSense] +"-第"+(currentUtteranceIndex+1)+"条对话--开始播放"
        )
        player.play(position[currentPosition],
                    allLanguage[currentLanguage],
                    sense[currentSense],
                    currentUtteranceIndex
            )

        timer = setTimeout(function () {
            if(currentUtteranceIndex !=29){

                //judge
                //如果显示未被唤醒，则判断网络是否正常，
                judge.judge(currentUtteranceIndex,allLanguage[currentLanguage],function (_data) {
                    //将结果保存
                    sender.send('console-event','result',JSON.stringify(_data))
                    next()
                })

            }else {
                if((sense.length-1) > currentSense){
                        currentSense++
                        currentUtteranceIndex = 0
                        next()
                }

                console.log('切换场景')
            }
        },25000)
    })

}

function judgeNetwork() {
    //用一个超大声音的唤醒词去唤醒，再去判断有无唤醒，若被唤醒，则继续next，没有就继续进行该项
    //play
    
    setTimeout(function () {
        
    },10000)
    
    
    setTimeout(function () {
        
    })

}

controller.setTodoListId = function (_todoListId) {
    todolistId = _todoListId
}


controller.pause = function () {

}

function reset() {
    currentUtteranceIndex = -1
    isNeedSilence = false
    isNeedKitchen = false
    isNeedMusic = false
    isNeedPlayback = false

    position_330 = false
    position_390 = false
    position_930 = false
    position_990 = false


    deviceSerialNumber = null

    currentLanguage = -1
    allLanguage = []

    isDeviceUnderControll = false

    todolistId = null
}


module.exports = controller

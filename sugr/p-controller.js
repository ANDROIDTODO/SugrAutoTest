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


let currentUtteranceIndex = -1
let isNeedSilence = false
let isNeedKitchen = false
let isNeedMusic = false
let isNeedPlayback = false

let position_330 = false
let position_390 = false
let position_930 = false
let position_990 = false


let deviceSerialNumber = null

let currentLanguage = -1
let allLanguage = []

let isDeviceUnderControll = false

let todolistId = null

let sender


function controller() {

}

controller.initialize = function (_browersDriver, _player, _judge, _emailer, _apiParser) {
    browersDriver = _browersDriver
    player = _player
    judge = _judge
    emailer = _emailer
    apiParser = _apiParser
}

controller.a = function () {

}

controller.setSN = function (_sn) {
    deviceSerialNumber = _sn
}

controller.setTodoListId = function (_id) {
    todolistId  = _id
    //
}

controller.startTest = function (config) {


    let _positions = config.position

    _positions.forEach((value) =>{
        //暂时只支持990
        if (value == '990'){
            position_990 = true
        }

    })

    let _sense_list = config.sense_list
    _sense_list.forEach(value =>{
        //暂时支支持silence
        if (value == 'silence'){
            isNeedSilence = true
        }
    })

    currentLanguage = 0
    allLanguage  = config.language

    next()

}

function next(){

    currentUtteranceIndex++
    console.log("currentUtteranceIndex:"+ currentUtteranceIndex)
    //player
    setTimeout(function () {
        if(currentUtteranceIndex !=29){
            //judge
            // judge.judge(currentUtteranceIndex,allLanguage[currentLanguage],function () {
            //
            // })
            next()
        }else {
            console.log('切换场景')
        }
    },1000)

}

controller.setTodoListId = function (_todoListId) {
    todolistId = _todoListId
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

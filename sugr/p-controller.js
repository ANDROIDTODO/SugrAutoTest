/**
 * Created by Jeromeyang on 2018/9/12.
 */
let browersDriver
let player
let judge
let emailer
let apiParser


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
let allLanguage = []

let isDeviceUnderControll = false

let todolistId

function controller() {

}

controller.initialize = function(_browersDriver,_player,_judge,_emailer,_apiParser){
       browersDriver = _browersDriver
       player = _player
       judge = _judge
       emailer = _emailer
       apiParser = _apiParser
}

controller.a = function(){

}

controller.startTest = function(){

}

controller.setTodoListId = function(_todoListId){
       todolistId = _todoListId
}




module.exports = controller

﻿/**
 * Created by Jeromeyang on 2018/9/12.
 */

/**
 * 规则是先切换场景，再切换位置，再切换语言
 */

const moment = require('moment')
const fs = require('fs')

let browersDriver
let player
let judge
let emailer
let apiParser
let xlsx


let deviceSerialNumber = null
let deviceType = null

let currentUtteranceIndex = -1
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

let cacheDir

let isLoopModeOn = false
let isPlayMusic = false
let isMusicStop = true


function controller() {

}

controller.initialize = function (_browersDriver, _player, _judge, _emailer, _apiParser, _xlsx) {
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
        browersDriver.getTODOList(todolistId, (_data) => {
            apiParser.parseTodoList(_data)
            browersDriver.getHistory(_data => {
                apiParser.parseHistory(_data)
                if (f != null) {
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
    todolistId = _id
    //
}

controller.setCacheDir = function (_path) {
    cacheDir = _path
}

controller.startTest = function (config, _sender) {

    xlsx.initialize()
    xlsx.reset()
    sender = _sender
    apiParser.setSender(_sender, deviceSerialNumber)
    judge.init(browersDriver, apiParser, todolistId)
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
    allLanguage = config.language
    isMusicStop = true
    isPlayMusic = false
    isLoopModeOn = false
    next()
}

function next() {

    // if(currentUtteranceIndex == -1){
    //     currentUtteranceIndex = currentUtteranceIndex+3
    // }else{
    //     currentUtteranceIndex = currentUtteranceIndex+5
    // }

    currentUtteranceIndex++
    console.log("currentUtteranceIndex:" + currentUtteranceIndex)
    startWithGetLastestData(function () {



        if(sense[currentSense] == 'playback'){
            if(isMusicStop){
                currentUtteranceIndex == -1
                playHappy()
                return
            }
        }

        if ((sense.length - 1) < currentSense) { //场景越界
            if((position.length -1) > currentPosition){
                currentPosition++
                currentUtteranceIndex = -1
                currentSense = 0

                isPlayMusic = false
                isLoopModeOn = false
                isMusicStop = true

                next()
                return

            }else {
                //所有测试结束
                controller.saveFile()
                console.log('测试结束')
                sender.send('console-event', 'result', '测试完毕！！！ ')
                sender.send('console-test-end')
                return
            }

        }



        // player
        sender.send('console-event', 'debug', "语言：" + allLanguage[currentLanguage] + "-位置：" + position[currentPosition]
            + "-场景" + sense[currentSense] + "-第" + (currentUtteranceIndex + 1) + "条对话--开始播放"
        )
        player.play(position[currentPosition],
            allLanguage[currentLanguage],
            sense[currentSense],
            currentUtteranceIndex
        )

        timer = setTimeout(function () {
            if (currentUtteranceIndex != 29) {

                //judge
                //如果显示未被唤醒，则判断网络是否正常，
                judge.judge(currentUtteranceIndex, allLanguage[currentLanguage], function (_data) {
                    //将结果保存
                    sender.send('console-event', 'result', JSON.stringify(_data))
                    xlsx.saveResult(allLanguage[currentLanguage], position[currentPosition], sense[currentSense], currentUtteranceIndex,_data)
                    next()
                })

            } else {

                judge.judge(currentUtteranceIndex, allLanguage[currentLanguage], function (_data) {
                    //将结果保存
                    sender.send('console-event', 'result', JSON.stringify(_data))
                    xlsx.saveResult(allLanguage[currentLanguage], position[currentPosition], sense[currentSense], currentUtteranceIndex,_data)
                    console.log("currentSense:" + currentSense + ",(sense.length-1):" + (sense.length - 1))
                    //这里判断是否在换场景的时候，当前的场景为playback ,若是，则stop music
                    if(sense[currentSense] == 'playback'){
                        playStop()
                        return
                    }
                    if ((sense.length - 1) > currentSense) {




                        currentSense++
                        currentUtteranceIndex = -1
                        console.log('切换场景')
                        sender.send('console-event', 'debug','切换场景')
                        //这里判断是否为playback
                        if(sense[currentSense] == 'playback'){

                            //根据不同语言
                            //播放play happy //如何通过API知道当前确实已经开始播放音乐，而且是happy,可能会存在streaming on other device
                            //播放loop mode on // 通过API知道loop mode on ,预测history
                            //是否能够根据api查看是否现在正在播放

                            //当测试完毕后，需要stop music

                            if(isMusicStop){
                                playHappy()
                            }
                        }else{
                            next()
                        }


                        
                    } else {

                        //切换位置
                        //场景要归位
                        if((position.length -1) > currentPosition){
                            currentPosition++
                            currentUtteranceIndex = -1
                            currentSense = 0

                            isPlayMusic = false
                            isLoopModeOn = false
                            isMusicStop = true

                            next()

                        }else {
                            //所有测试结束
                            controller.saveFile()
                            console.log('测试结束')
                            sender.send('console-event', 'result', '测试完毕！！！ ')
                            sender.send('console-test-end')
                        }



                    }

                })

            }
        }, 20000)
    })

}

function judgeNetwork() {
    //用一个超大声音的唤醒词去唤醒，再去判断有无唤醒，若被唤醒，则继续next，没有就继续进行该项
    //play

    setTimeout(function () {

    }, 10000)


    setTimeout(function () {

    })

}

function playHappy(){

    if(!isPlayMusic){
        //播放
        setTimeout(()=>{
            player.playback(allLanguage[currentLanguage],'happy')
        

    setTimeout(()=>{
        //判断是否有播放
        //判断是否loop mode on
        browersDriver.getPlayerInfo(deviceSerialNumber,(_data) => {
            
            let data = JSON.parse(_data)
            let playerInfo = data.playerInfo
            let infoText = playerInfo.infoText
            if(playerInfo.state == 'PLAYING'){
                console.log(infoText.subText1)
                console.log(infoText.subText2)
                console.log(infoText.subText2.indexOf("Happy"))
                if(infoText != null && infoText.subText1 == 'Pharrell Williams' && infoText.subText2.indexOf("Happy") != -1){
                    isPlayMusic = true
                    sender.send('console-event', 'result', '播放Happy成功！')
                    playLoopModeOn()
                    return
                }
            }

            playHappy(allLanguage[currentLanguage])
        })

        },15000)
    },15000)
        
    }
}

function playLoopModeOn(language){
    console.log(isLoopModeOn)
    if(!isLoopModeOn){
        setTimeout(()=>{
            player.playback(allLanguage[currentLanguage],'loop')
        
        
    

     setTimeout(()=>{
        //判断是否有播放
        //判断是否loop mode on
        browersDriver.getPlayerInfo(deviceSerialNumber,(_data) => {
            
            let data = JSON.parse(_data)
            let playerInfo = data.playerInfo
            if(playerInfo.state == 'PLAYING'){
                

                let tans = playerInfo.transport
                if(tans != null && tans.repeat == 'SELECTED'){
                    sender.send('console-event', 'result', 'Loop mode on成功！')
                    isPlayMusic = true
                    isLoopModeOn = true
                    isMusicStop = false
                    currentUtteranceIndex = -1
                    next()
                }

            }else {
                isPlayMusic = false
                playHappy(allLanguage[currentLanguage])
                }
            })

            },20000)
        },15000)
     }
}

function playStop(){
    if(!isMusicStop){
        setTimeout(()=>{
            player.playback(allLanguage[currentLanguage],'stop')
        

     setTimeout(()=>{

        browersDriver.getPlayerInfo(deviceSerialNumber,(_data) => {
            
            let data = JSON.parse(_data)
            let playerInfo = data.playerInfo
            if(playerInfo.state == null || playerInfo.state == 'PAUSED' || playerInfo.state == 'STOP'){
                sender.send('console-event', 'result', '音乐停止成功！')
                isPlayMusic = false
                isMusicStop = true
                currentSense++
                currentUtteranceIndex = -1
                console.log('切换场景1')
                next()
            }else{
                playStop()
            }

        })
     },15000)
    },15000)
        
    }
}

controller.setTodoListId = function (_todoListId) {
    todolistId = _todoListId
}


controller.pause = function () {
    clearTimeout(timer)
}

controller.resume = function () {
    currentUtteranceIndex--
    next()
}

controller.reset = function reset() {


    currentUtteranceIndex = -1
    currentLanguage = -1
    currentPosition = -1
    currentSense = -1
    allLanguage = []
    position = []
    sense = []




}

controller.saveFile = function () {
    let time = moment().format('YYYYMMDDHHmm')
    let dirCreated = cacheDir+"\\"+time + '\\'
    fs.mkdirSync(cacheDir+"\\"+time + '\\')
    xlsx.saveFile(allLanguage[currentLanguage],dirCreated+'\\result.xlsx')
}


module.exports = controller

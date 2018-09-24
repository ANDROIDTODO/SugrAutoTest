/**
 * Created by Jeromeyang on 2018/9/12.
 *
 */

///筛选出最近一次的更新

let sender
let deviceSerialNumber

let lastestCardCreateTime = -1

let lastestHistoryCreateTime = -1

let lastestTodoItemCreateTime = -1

function ApiParse() {

}


ApiParse.setSender = function (_sender) {
    sender = _sender
}

ApiParse.setDeviceSerialNumber = function (_deviceSerialNumber) {
    deviceSerialNumber = _deviceSerialNumber
}

ApiParse.setSender = function (_sender, _deviceSerialNumber) {
    sender = _sender
    deviceSerialNumber = _deviceSerialNumber
}

ApiParse.reset = function () {
    deviceSerialNumber = null
    lastestCardCreateTime = -1
    lastestHistoryCreateTime = -1
    lastestTodoItemCreateTime = -1
}

ApiParse.parseCardData = function (_data) {
    let data = JSON.parse(_data)
    let cards = data.cards
    let _result = []

    if (cards.length > 0) {
        try {
            console.log("parseCardData 1")
            cards.forEach(v => {
                //TODO 若没有发现则取第一个作为基准
                

                if (v.sourceDevice.serialNumber == deviceSerialNumber) {
                    let heard
                    let answer = ''
                    let time
                    let serialNumber

                    console.log("parseCardData 2")
                    if (v.playbackAudioAction != null) {
                        heard = v.playbackAudioAction.mainText
                    }


                    if (v.descriptiveText != null) {
                        answer = v.descriptiveText[0]
                    }
                    time = v.creationTimestamp
                    serialNumber = v.sourceDevice.serialNumber


                    let _card = {
                        heard,
                        answer,
                        time,
                        serialNumber
                    }


                    if (lastestCardCreateTime == -1) {
                        sender.send('console-event', 'info', JSON.stringify(_card))
                        console.log('parseCardData return 1')
                        throw new Error('break')
                    } else if (time <= lastestCardCreateTime) {
                        lastestCardCreateTime = cards[0].creationTimestamp
                        console.log('parseCardData return 2')
                        sender.send('console-event', 'info', JSON.stringify(_result))
                        throw new Error('break')
                    } else {
                        console.log('parseCardData return 3')
                        _result.push(_card)
                    }
                }


            })
        } catch (e) {
            console.log(e.message)
        }

        lastestCardCreateTime = cards[0].creationTimestamp
        if (lastestCardCreateTime == -1) {
            return null
        } else {
            if (_result.length == 0) {
                return null
            } else {
                return _result
            }

        }

    }
}

ApiParse.parseTodoList = function (_data) {
    let data = JSON.parse(_data)
    let list = data.list

    let _result = []

    if (list.length > 0) {

        try {


            list.forEach(v => {

                let time = v.createdDateTime
                let value = v.value
                let id = v.id
                let _todo = {
                    value,
                    time,
                    id
                }

                if (lastestTodoItemCreateTime == -1) {
                    sender.send('console-event', 'info', JSON.stringify(_todo))
                    console.log('parseTodoList return 1')
                    throw new Error('break')

                } else if (time <= lastestTodoItemCreateTime) {
                    sender.send('console-event', 'info', JSON.stringify(_result))
                    console.log('parseTodoList return 2')
                    throw new Error('break')

                } else {
                    _result.push(_todo)
                }


            })

        } catch (e) {

        }
        lastestTodoItemCreateTime = list[0].createdDateTime
        if (lastestTodoItemCreateTime == -1) {
            return null
        } else {
            if (_result.length == 0) {
                return null
            } else {
                return _result
            }

        }
    }
}

ApiParse.parseHistory = function (_data) {
    let data = JSON.parse(_data)
    let activities = data.activities

    let _result = []

    if (activities.length > 0) {

        try {


            activities.forEach(v => {


                if (v.sourceDeviceIds[0].serialNumber == deviceSerialNumber) {


                    let time = ''
                    let serialNumber = ''
                    let summary = ''
                    let toDoId = ''
                    let value = ''

                    time = v.creationTimestamp
                    serialNumber = v.sourceDeviceIds[0].serialNumber

                    try {

                        let _summary = JSON.parse(v.description)
                        summary = _summary.summary
                        if (summary == undefined) {
                            summary = ''
                        }
                    } catch (e) {

                        console.log("history summary parse error: " + e.message)
                    }

                    try {
                        let _todo = JSON.parse(v.domainAttributes)
                        toDoId = _todo.toDoId
                        value = _todo.value
                        if (toDoId === undefined) {
                            toDoId = ''
                        }
                        if (value === undefined) {
                            value = ''
                        }
                    } catch (e) {
                        console.log("history todo parse error: " + e.message)
                    }


                    let _history = {
                        summary,
                        toDoId,
                        value,
                        time,
                        serialNumber
                    }

                    if (lastestHistoryCreateTime == -1) { //只需要获取第一个
                        sender.send('console-event', 'info', JSON.stringify(_history))
                        console.log('parseHistory return 1')
                        throw new Error('break')
                    } else if (time <= lastestHistoryCreateTime) {
                        sender.send('console-event', 'info', JSON.stringify(_result))
                        console.log('parseHistory return 2')
                        throw new Error('break')
                    } else {
                        _result.push(_history)
                    }
                }
            })

        } catch (e) {

        }

        lastestHistoryCreateTime = activities[0].creationTimestamp


        if (lastestHistoryCreateTime == -1) {
            return null
        } else {
            if (_result.length == 0) {
                return null
            } else {
                return _result
            }

        }
    }
}


module.exports = ApiParse
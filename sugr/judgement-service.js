/**
 * Created by Jeromeyang on 2018/9/12.
 */

let browersDriver
let apiParser
let todolistId

let xlsx

//// 需要获取excel的正确回答的关键词
let en_keyword

function judge() {

}

judge.init = function (_deriver, _apiParser,_todolistId) {
    browersDriver = _deriver
    apiParser = _apiParser
    todolistId = _todolistId
}

judge.setXlsx = function (_xlsx) {
    xlsx = _xlsx
}

judge.judge = function (index,language,f) {
    let _card
    let _item
    let _history

    let keywordList


    keywordList =xlsx.getKeyword(language)
    let keyword = keywordList[index]


    browersDriver.getCardList((_data) => {
        _card = apiParser.parseCardData(_data)
        // 获取当前itemId最近一个的todo item（updatedDateTime，value）
        browersDriver.getTODOList(todolistId, (_data) => {
            _item = apiParser.parseTodoList(_data)
            browersDriver.getHistory(_data => {
                _history = apiParser.parseHistory(_data)

                let isWakeup
                let heard
                let answer
                let isCorrect
                //todoitem

                if (_history != null){
                    isWakeup = true
                }else {
                    isWakeup = false
                }

                if (index == 2 || index == 7 || index == 12 || index == 17 || index == 22 || index == 27){
                    console.log('todo list judge 1 ')
                    console.log(JSON.stringify(_history))
                    if(_history != null){
                        _history.forEach(v =>{

                            if(v.summary.indexOf('to do list')){
                                console.log('todo list judge 2 ' )
                                heard = v.summary
                                console.log(heard)
                                if (heard != null){
                                    console.log('todo list judge 3 ')


                                    let correctNum = 0
                                    for(let i = 0; i < keyword.length ;i++){
                                        if (heard != null && heard.indexOf(keyword[i]) != -1){
                                            correctNum++
                                        }
                                    }
                                    console.log('todo list judge 4 : ' + correctNum +"," + keyword.length)

                                    isCorrect = correctNum == keyword.length;
                                    if (isCorrect){ //纠错
                                        isWakeup = true
                                    }
                                }
                            }
                        })

                    }
                }else { //displaycard
                    if (_card != null){

                        let __card = _card[0]
                        heard = __card.heard
                        answer = __card.answer
                        let correctNum = 0
                        for(let i = 0; i < keyword.length ;i++){
                            if (answer != null && answer.indexOf(keyword[i]) != -1){
                                correctNum++
                            }
                        }
                        isCorrect = correctNum == keyword.length;
                        if (isCorrect){ //纠错
                            isWakeup = true
                        }

                    }else {
                        heard = ''
                        answer = ''
                        isCorrect = false
                    }
                }


                let _result = {
                    isWakeup,
                    heard,
                    answer,
                    isCorrect
                }

                f(_result)

            })
        })
    })


}

module.exports = judge
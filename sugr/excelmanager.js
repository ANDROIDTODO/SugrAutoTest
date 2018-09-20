const XLSX = require("xlsx");
const fs = require('fs')
const path = require('path')

let EN_workbook


let EN_keyword = []


function xlsx() {

}

xlsx.initialize = function (path,chromeDriver,controller) {
    // EN_workbook = XLSX.readFile(path)
    // console.log(EN_workbook.SheetNames.length)
    // let sheetname = EN_workbook.SheetNames[0]
    // console.log(sheetname)
    // let worksheet = EN_workbook.Sheets[sheetname];
    //
    // let cell = worksheet['A'+4]
    // // cell.v = 'no'
    // console.log(cell)
    // XLSX.writeFile(workbook, 'out.xlsx');

    // console.log(workbook.utils.sheet_to_json(worksheet))


    parse('en')


}

xlsx.getKeyword = function (index) {
    if (index == 'en'){
        return EN_keyword
    }
    else {
        return null
    }
}

xlsx.reset = function () {
    EN_workbook = null
    parseBook('en')
}

function parse(index) {
    let workbook
    workbook = parseBook(index)

    let keyword = []
    let sheetname = workbook.SheetNames[0]
    let worksheet = workbook.Sheets[sheetname];

    for (let i = 2; i <= 31 ;i++){
        let cell = worksheet['B'+i]
        let word = cell.v
        let arr = word.split(',')

        keyword.push(arr)
    }





    if(index == 'en'){
        EN_keyword = keyword
    }

    console.log(EN_keyword)
}

function parseBook(index) {
    let workbook = null
    if (index == 'en'){
        let xlsxPath = path.join(__dirname,'../assets/config/EN-US.xlsx');
        workbook = XLSX.readFile(xlsxPath)
        EN_workbook = workbook
    }

    return workbook
}







module.exports = xlsx
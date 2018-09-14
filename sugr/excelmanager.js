const XLSX = require("xlsx");
const fs = require('fs')

let workbook

function xlsx() {

}

xlsx.initialize = function (path,chromeDriver,controller) {

    workbook = XLSX.readFile(path)
    let sheetname = workbook.SheetNames[0]
    // console.log(sheetname)
    let worksheet = workbook.Sheets[sheetname];

    let cell = worksheet['A4']
    cell.v = 'no'
    console.log(cell)
    // XLSX.writeFile(workbook, 'out.xlsx');

    // console.log(workbook.utils.sheet_to_json(worksheet))
}

module.exports = xlsx
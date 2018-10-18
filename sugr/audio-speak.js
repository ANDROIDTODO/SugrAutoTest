const cmd = require('node-cmd')
const path = require('path')


let playScript
let playPath
let playerPath

let files = ['01_P1_F.wav','02_P1_F.wav','03_P1_F.wav','04_P1_F.wav','05_P1_F.wav',
			 '06_P2_F.wav','07_P2_F.wav','08_P2_F.wav','09_P2_F.wav','10_P2_F.wav',
			 '11_P3_F.wav','12_P3_F.wav','13_P3_F.wav','14_P3_F.wav','15_P3_F.wav',
			 '16_P4_M.wav','17_P4_M.wav','18_P4_M.wav','19_P4_M.wav','20_P4_M.wav',
			 '21_P5_M.wav','22_P5_M.wav','23_P5_M.wav','24_P5_M.wav','25_P5_M.wav',
			 '26_P6_M.wav','27_P6_M.wav','28_P6_M.wav','29_P6_M.wav','30_P6_M.wav',
			]

let positionDir = {
	'990':'position_990',
	'930':'position_930',
	'330':'position_330',
	'390':'position_390'
}

function speaker () {

}

speaker.setPlayerPath = function(_playerPath){
playerPath = _playerPath
}

speaker.init = function(){
	if(process.platform.indexOf('win')){
		
		playScript = path.join(__dirname, '../assets/script/windows/play.bat')
	}

	playScript = path.join(__dirname, '../assets/script/windows/play.bat')
	playPath = path.join(__dirname, '../assets/utterances')
}



speaker.play = function(_position,language,sense,index){

	let __cmd = playScript + ' ' + playerPath + ' ' + playPath + '\\' + positionDir[_position] +'\\' +language + '\\' + sense + '\\' 
				+ files[index]
	console.log(__cmd)
    excute(__cmd)
}

speaker.playback = function(language,which){
	
}

function excute(cmd_){
	cmd.get(cmd_,function(err,data,stderr){
                               console.log(err)
                               console.log(data)
                               console.log(stderr)
                       }
               )
}

module.exports = speaker

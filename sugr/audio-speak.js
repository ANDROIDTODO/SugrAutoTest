const cmd = require('node-cmd')



function speaker () {

}


speaker.play = function(position,sense,index){
       cmd.get('C:\\Users\\Jerome\\Desktop\\start.bat',
                       function(err,data,stderr){
                               console.log(err)
                               console.log(data)
                               console.log(stderr)
                       }
               )
}

module.exports = speaker

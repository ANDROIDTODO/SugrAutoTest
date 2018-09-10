/**
 * Created by Jeromeyang on 2018/9/5.
 */

const {ipcRenderer} = require('electron')


const alexaLogin = document.getElementById('alexa-login')
const startTest = document.getElementById('start')
const sn_confirm = document.getElementById('sn-confirm')







alexaLogin.addEventListener('click', () => {
    console.log("click alexa login button!")

    ipcRenderer.send('start-click')

})

startTest.addEventListener('click', () => {

  console.log('click start test button!')
    //采集信息
    let _date

    let sense_list = []

    if ($('#sense_silence_cb').prop('checked')){
        sense_list.push('silence')
    }

    if ($('#sense_kitchen_cb').prop('checked')) {
        sense_list.push('kitchen')
    }

    if ($('#sense_music_cb').prop('checked')) {
        sense_list.push('music')
    }


    if ($('#sense_playback_cb').prop('checked')) {
        sense_list.push('playback')
    }

    let language = $('#language').val()

    let position = []

    position.push($("input[name='position']:checked").val())

    _date = {
        sense_list,
        language,
        position
    }




    console.log(_date)

    ipcRenderer.send('test111')



})

ipcRenderer.on('alexa-login-event', (event,r) => {
    if (r === 1){
        alexaLogin.classList.add('layui-btn-disabled')
        sn_confirm.classList.remove('layui-btn-disabled')
        alexaLogin.innerHTML = '已登录'
    }else if (r === 2){
        alexaLogin.classList.remove('layui-btn-disabled')
        alexaLogin.innerHTML = '登录'
        sn_confirm.classList.add('layui-btn-disabled')
    }
})


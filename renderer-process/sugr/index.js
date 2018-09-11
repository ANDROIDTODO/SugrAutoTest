/**
 * Created by Jeromeyang on 2018/9/5.
 */

const {ipcRenderer, dialog} = require('electron')
const path = require('path')


const alexaLogin = document.getElementById('alexa-login')
const startTest = document.getElementById('start')
const sn_confirm = document.getElementById('sn-confirm')

let isRetryGetDevices = false;


alexaLogin.addEventListener('click', () => {
    console.log('click alexa login button!')

    ipcRenderer.send('alexa-login-click')

})

startTest.addEventListener('click', () => {

    console.log('click start test button!')
    //采集信息
    let _date

    let sense_list = []

    if ($('#sense_silence_cb').prop('checked')) {
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

    position.push($('input[name=\'position\']:checked').val())

    _date = {
        sense_list,
        language,
        position
    }

    console.log(_date)

    ipcRenderer.send('start-test-click')
    console.log(__dirname)


})

sn_confirm.addEventListener('click', function () {
    if (isRetryGetDevices) {
        ipcRenderer.send('refresh-devices-click')
    } else {
        //确定
        let text = $('#serialNumber').val()

        if (text == null || text === '') {
            ipcRenderer.send('show-error-dialog', '错误', '请填写有效完整的序列号！')
        } else {
            console.log('serialNumber:' + text)
            ipcRenderer.send('confirm-device-sn', text)
        }


    }
})

ipcRenderer.on('alexa-login-event', (event, r) => {
    if (r === 1) {
        alexaLogin.classList.add('layui-btn-disabled')
        alexaLogin.innerHTML = '已登录'
    } else if (r === 2) {
        alexaLogin.classList.remove('layui-btn-disabled')
        alexaLogin.innerHTML = '登录'
        sn_confirm.classList.add('layui-btn-disabled')
        $("#sn-confirm").attr({"disabled": "disabled"});
    }
})

ipcRenderer.on('alexa-no-devices', (event, noDevices) => {
    sn_confirm.classList.remove('layui-btn-disabled')
    $("#sn-confirm").removeAttr("disabled");
    isRetryGetDevices = noDevices
    if (noDevices) {
        sn_confirm.innerHTML = '重试'
    }

})



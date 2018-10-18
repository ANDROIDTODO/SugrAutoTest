/**
 * Created by Jeromeyang on 2018/9/5.
 */

const {ipcRenderer, dialog} = require('electron')
const path = require('path')


const alexaLogin = document.getElementById('alexa-login')
const startTest = document.getElementById('start')
const sn_confirm = document.getElementById('sn-confirm')

const stopTest = document.getElementById('stop')
const choicePlayer = document.getElementById('choice_player')
const clearLog = document.getElementById('clear-log')
const choiceCacheDir = document.getElementById('choice-cache-dir')
let isRetryGetDevices = false;

let startStatus = -1



layui.use('form', function () {
    var form = layui.form;

    form.on('switch(console-scroll)', function (data) {
        console.log(data.elem.checked); //开关是否开启，true或者false
        ipcRenderer.send('switch-scroll', data.elem.checked)
    });


    form.on('select(notify-language)', function(data){
        ipcRenderer.send('notify-language', data.value)
    });
});

choiceCacheDir.addEventListener('click',()=>{
  ipcRenderer.send('choice-cache-dir')
})

clearLog.addEventListener('click',() =>{
    ipcRenderer.send('clear-log-click')
})

stopTest.addEventListener('click', () => {
    console.log('click stop button!')
    ipcRenderer.send('stop-test')


})

choicePlayer.addEventListener('click', () => {
    console.log('click choicePlayer button!')
    ipcRenderer.send('choice-player')


})

alexaLogin.addEventListener('click', () => {
    console.log('click alexa login button!')

    ipcRenderer.send('alexa-login-click')

})

startTest.addEventListener('click', () => {

    console.log('click start test button!')
    //采集信息
    if (startStatus == -1) {


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

        let _language = $('#language').val()

        let language = []
        language.push(_language)


        let position = []

        // position.push($('input[name=\'position\']:checked').val())

        if ($('#position_990_cb').prop('checked')) {
            position.push('990')
        }

        if ($('#position_930_cb').prop('checked')) {
            position.push('930')
        }

        if ($('#position_330_cb').prop('checked')) {
            position.push('330')
        }

        if ($('#position_390_cb').prop('checked')) {
            position.push('390')
        }

        _date = {
            sense_list,
            language,
            position
        }

        console.log(_date)


        ipcRenderer.send('start-test-click', _date)

    }else if(startStatus == 1){
        //暂停
        ipcRenderer.send('pause-test')

    }else if(startStatus == 0){
        //继续
        ipcRenderer.send('resume-test')
    }
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

ipcRenderer.on('start-test-response', (event) => {
    stopTest.classList.remove('layui-btn-disabled')
    $("#stop").removeAttr("disabled");
    startTest.innerHTML = '暂停'
    startStatus = 1
})

ipcRenderer.on('pause-test-response', (event) => {
    startTest.innerHTML = '开始'
    startStatus = 0
})


ipcRenderer.on('stop-test-response', (event) => {
    stopTest.classList.add('layui-btn-disabled')
    $("#stop").attr({"disabled": "disabled"});
    startTest.innerHTML = '开始'
    startStatus = -1
})

ipcRenderer.on('end-test-response', (event) => {
    stopTest.classList.add('layui-btn-disabled')
    $("#stop").attr({"disabled": "disabled"});
    startTest.innerHTML = '开始'
    startStatus = -1
})


ipcRenderer.send('get-cache-dir')
ipcRenderer.send('get-player-path')

ipcRenderer.on('cache-dir-response',(event,path)=>{
    console.log('cache-dir-response:'+path)
    $("#cache-dir").text(path)
})

ipcRenderer.on('player-path-response',(event,path)=>{
    $("#palyer-path").text(path)
})

ipcRenderer.on('console-test-end',(event)=>{
    ipcRenderer.send('end-test')
})



//stopTest.classList.remove('layui-btn-disabled')
//$("#stop").removeAttr("disabled");

//stopTest.classList.add('layui-btn-disabled')
//$("#stop").attr({"disabled": "disabled"});




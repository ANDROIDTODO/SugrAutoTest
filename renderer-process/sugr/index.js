/**
 * Created by Jeromeyang on 2018/9/5.
 */

const {ipcRenderer} = require('electron')


const alexaLogin = document.getElementById('alexa-login')
const startTest = document.getElementById('start')
const sense_silence_cb = document.getElementById('sense_silence_cb')
const sense_kitchen_cb = document.getElementById('sense_kitchen_cb')
const sense_music_cb = document.getElementById('sense_music_cb')
const sense_playback_cb = document.getElementById('sense_playback_cb')


layui.use('form', function(){
    var form = layui.form;
    console.log('console.log(data.elem); console.log(data.elem); ');


    form.on('checkbox()', function(data){

        console.log(data.elem.id); //是否被选中，true或者false


    });


    //各种基于事件的操作，下面会有进一步介绍
});

alexaLogin.addEventListener('click', () => {
    console.log("click alexa login button!")

    ipcRenderer.send('start-click')

})

startTest.addEventListener('click', () => {

  console.log('click start test button!')
    //采集信息
    let sense_list = []

    if ($('#sense_playback_cb').prop('checked')){
        sense_list.push('silence')
    }
    // if (sense_playback_cb.hasAttribute('checked')) {
    //     sense_list.push('silence')
    // }

    // if (sense_kitchen_cb.hasAttribute('checked')) {
    //     sense_list.push('kitchen')
    // }
    //
    // if (sense_music_cb.hasAttribute('checked')) {
    //     sense_list.push('music')
    // }
    //
    //
    // if (sense_playback_cb.hasAttribute('checked')) {
    //     sense_list.push('playback')
    // }

    console.log($('#sense_playback_cb').prop('checked'))
})

ipcRenderer.on('alexa-login-event', (event,r) => {
    if (r === 1){
        alexaLogin.classList.add('layui-btn-disabled')
        alexaLogin.innerHTML = '已登录'
    }else if (r === 2){
        alexaLogin.classList.remove('layui-btn-disabled')
        alexaLogin.innerHTML = '登录'
    }
})


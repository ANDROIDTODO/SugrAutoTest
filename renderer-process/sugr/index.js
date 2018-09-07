/**
 * Created by Jeromeyang on 2018/9/5.
 */

const {clipboard,ipcRenderer} = require('electron')
let browersDriver = require('../../sugr/alexa-chrome-driver')


const alexaLogin = document.getElementById('alexa-login')
const startTest = document.getElementById('start')

alexaLogin.addEventListener('click', () => {
    console.log("click alexa login button!")
    browersDriver.openBrowser('https://alexa.amazon.com/',(r) => {
        console.log(r)
      ipcRenderer.send('console-manager-event','哈哈哈\n')
        if (r == 1) {
          alexaLogin.classList.add('layui-btn-disabled')
          alexaLogin.innerHTML = '已登录'
        }else if (r == 2) {
          alexaLogin.classList.remove('layui-btn-disabled')
          alexaLogin.innerHTML = '登录'
        }
    })
    //   .then((r) => {
    //         console.log(r)
    //   }).catch((e) => {
    //   console.log(e)
    // })
})

startTest.addEventListener('click', () => {

  console.log('click start test button!')


})

// ipcRenderer.on()


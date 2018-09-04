/**
 * Created by Jeromeyang on 2018/9/5.
 */

const {clipboard} = require('electron')
let browersDriver = require('./alexa-chrome-driver')



const alexaLogin = document.getElementById('alexa-login')

alexaLogin.addEventListener('click', () => {
    console.log("click alexa login button!")
    browersDriver.openBrowser('https://alexa.amazon.com/api/cards');
})
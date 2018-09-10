/**
 * Created by Jeromeyang on 2018/9/5.
 */

const {Builder, By, Key, until} = require('selenium-webdriver')

const URL_DEVICE_LIST = 'https://alexa.amazon.com/api/devices-v2/device'

let driver = null
let window = null;
let chromeOptions = null;
let alexaListId;
// 我们需要给出算法库的版本等等

function browserDriver() {

}

//需要返回 当前browers关闭状态,是否登录状态
browserDriver.openBrowser = async function (url, f) {

    if (driver != null) {
        return
    }
    driver = await new Builder().forBrowser('chrome').build()
    chromeOptions = driver.chromeOptions

    window = driver.manage().window()
    window.maximize()

    try {
        await driver.get(url)
        f(3, null)
        console.log('openBrowser1  ')
        driver.getCurrentUrl().then((url1) => {
            console.log('openBrowser1 : ' + url1)
            if (url1 == url) {
                driver.sleep(2000).then(() => {
                    driver.quit();
                    driver = null;
                    f(2, null)
                })

            }
        })


        await driver.wait(until.titleIs('Amazon Alexa'))
        console.log('current title is Amazon alexa')
        window.minimize()

        f(1, null)

        console.log("waiting start")
        f(4,null)
        // 获取当前在线的设备，并选择序列号
        // 获取当前序列号的itemId
        // 获取当前itemId最近一个的todo item（updatedDateTime，value）
        // 获取history中最近的一个item （creationTimestamp） //是否被唤醒
        this.getDeviceOnlineList(function (result) {
            f(5, result)
        })
        await driver.wait(until.titleIs('xxxxxx'))
        console.log("waiting end")
    } catch (e) {
        console.log(e);
        driver.quit();
        driver = null;
        f(2)
    } finally {
        // driver.quit()
    }
}


browserDriver.getDeviceOnlineList = async(f) => {
    await driver.get(URL_DEVICE_LIST)
    let STR_READY_STATE = ''
    while (STR_READY_STATE != 'complete') {
        await driver.executeAsyncScript(
            function () {
                var callback = arguments[arguments.length - 1];
                callback(document.readyState)
            }
        ).then(function (str) {
            console.log('executeAsyncScript result:' + str)
            STR_READY_STATE = str
        })

        driver.sleep(500)
    }

    await driver.findElement(By.css('body')).then(function (found) {
        found.getText().then(function (_body) {
            console.log(_body);
            let data = JSON.parse(_body)
            let devices = data.devices
            //

            // if (devices.length == 0){
            //     f(null)
            //     return
            // }

            devices.forEach(v => {
                if (v.online) {
                    let serialNumber = v.serialNumber
                    let accountName = v.accountName
                    let deviceTypeFriendlyName = v.deviceTypeFriendlyName
                    let online = v.online
                    let result = {
                        serialNumber,
                        accountName,
                        deviceTypeFriendlyName,
                        online,
                    }

                    f(result)
                }
            })
        })
    })


}

browserDriver.getTODOList = async() => {

}

browserDriver.getCardList = async() => {

}

module.exports = browserDriver
/**
 * Created by Jeromeyang on 2018/9/5.
 */

const {Builder, By, Key, until} = require('selenium-webdriver')


function browserDriver() {

}

browserDriver.openBrowser = function (url) {
    let driver =  new Builder().forBrowser('chrome').build();
    driver.get(url)
}


module.exports = browserDriver
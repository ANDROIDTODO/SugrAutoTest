/**
 * Created by Jeromeyang on 2018/9/5.
 */

const {Builder, By, Key, until} = require('selenium-webdriver')

let driver = null
let alexaListId;
// 我们需要给出算法库的版本等等

function browserDriver () {

}

//需要返回 当前browers关闭状态,是否登录状态
browserDriver.openBrowser = async function (url,f) {

  if (driver!=null){
    return
  }
  driver = await new Builder().forBrowser('chrome').build()


  try{
    await driver.get(url)
      f(3)
    console.log('openBrowser1  ')
    driver.getCurrentUrl().then((url1) => {
      console.log('openBrowser1 : ' + url1)
      if(url1 == url){
        driver.sleep(2000).then(() =>{
          driver.quit();
          driver = null;
          f(2)
        })

      }
    })

    await driver.wait(until.titleIs('Amazon Alexa'))
    console.log('current title is Amazon alexa')
    f(1)

    console.log("waiting start")
    await driver.wait(until.titleIs('xxxxxx'))
    console.log("waiting end")
  }catch (e) {
    console.log(e);
    driver.quit();
    driver = null;
    f(2)
  }finally {
    // driver.quit()
  }
}


browserDriver.getTODOList = async () => {

}

browserDriver.getCardList = async () => {

}

module.exports = browserDriver
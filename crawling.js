const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require('puppeteer');

//TropicalTidibits : TD
//cyclonicwx : CWX

class CrawlingClass { 

  constructor(){
    this.crawlingList = [
      { url : 'https://cyclonicwx.com/storms/' , func : '' }
    ]
  } 

  GetCwx =  ($) => {

    const lists = $(".curtracks");              // 복사한 리스트의 Selector로 리스트를 모두 가져온다.

    const CycloneDataList = new Promise ( resolve => {

      const trackImageList = []; 
      lists.each((index, list) => {               // 모든 리스트를 순환한다.
        trackImageList[index] = {
            title: $(list).find('#info > span:nth-child(3)').text(),
            image_url:$(list).find('.track ').attr('src'),
            locate: $(list).find('#info > span:nth-child(4)').text()
        };  
      });

      resolve(trackImageList);
      
    });
  }



   GetStormInfo = async(url, callFunc ) => {

    // 브라우저를 실행한다.
    // 옵션으로 headless모드를 끌 수 있다.
    const browser = await puppeteer.launch({
      headless: false
    });
    
    // 새로운 페이지를 연다.
    const page = await browser.newPage();
    
    // 페이지의 크기를 설정한다.
    await page.setViewport({
      width: 1366,
      height: 768
    });
    await page.goto('https://cyclonicwx.com/storms/');
    //await page.goto(url);
   
    const content = await page.content();       // 페이지의 HTML을 가져온다.
    
    const $ = cheerio.load(content);            // $에 cheerio를 로드한다.
    
    const lists = $(".curtracks");              // 복사한 리스트의 Selector로 리스트를 모두 가져온다.


    const CycloneDataList = new Promise ( resolve => {


      const trackImageList = []; 
      lists.each((index, list) => {               // 모든 리스트를 순환한다.
        trackImageList[index] = {
            title: $(list).find('#info > span:nth-child(3)').text(),
            image_url:$(list).find('.track ').attr('src'),
            locate: $(list).find('#info > span:nth-child(4)').text()
        };  
      });

      resolve(trackImageList);
      
    });
    
    // 브라우저를 종료한다.
    browser.close();

    return CycloneDataList;

  };
  

}

/*
const GetStormInfo =  async() => {

    // 브라우저를 실행한다.
    // 옵션으로 headless모드를 끌 수 있다.
    const browser = await puppeteer.launch({
      headless: false
    });
    
    // 새로운 페이지를 연다.
    const page = await browser.newPage();
    
    // 페이지의 크기를 설정한다.
    await page.setViewport({
      width: 1366,
      height: 768
    });
    await page.goto('https://cyclonicwx.com/storms/');
   
    const content = await page.content();       // 페이지의 HTML을 가져온다.
    
    const $ = cheerio.load(content);            // $에 cheerio를 로드한다.
    
    const lists = $(".curtracks");              // 복사한 리스트의 Selector로 리스트를 모두 가져온다.

    const CycloneDataList = new Promise ( resolve => {

      const trackImageList = []; 
      lists.each((index, list) => {               // 모든 리스트를 순환한다.
        trackImageList[index] = {
            title: $(list).find('#info > span:nth-child(3)').text(),
            image_url:$(list).find('.track ').attr('src'),
            locate: $(list).find('#info > span:nth-child(4)').text()
        };  
      });

      resolve(trackImageList);
      
    });
    
    // 브라우저를 종료한다.
    browser.close();

    return CycloneDataList;

  };*/


CrawlingClass = new CrawlingClass();
//CrawlingClass.GetStormInfo();

    
//  exports.getHtmlFromTD = getHtmlFromTD;
//  exports.getHtmlFromCWX = getHtmlFromCWX;
  exports.GetStormInfo = CrawlingClass.GetStormInfo()


  
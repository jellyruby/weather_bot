const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require('puppeteer');
const downloadFile = require('./donwloader');

//TropicalTidibits : TD
//cyclonicwx : CWX

class CrawlingClass { 

  cycloneDataList = [];
  browser = null;
  page = null;

  constructor(){
    
    
  } 

  async init(url){
    this.browser =  await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
    });
    
    this.page = await this.browser.newPage();
  
    // 페이지의 크기를 설정한다.
    await this.page.setViewport({
      width: 1366,
      height: 768
    });
    
    await this.page.goto(url);

    this.content = await this.page.content();       // 페이지의 HTML을 가져온다.
  }


   GetStormInfo = async(url, callFunc ) => {

    await this.init(url);
    
    const $ = cheerio.load(this.content);            // $에 cheerio를 로드한다.
    
    const lists = $(".curtracks");              // 복사한 리스트의 Selector로 리스트를 모두 가져온다.

    const CycloneDataList = new Promise ( resolve => {

      const trackImageList = []; 
      lists.each((index, list) => {               // 모든 리스트를 순환한다.
        trackImageList[index] = {
            title: $(list).find('#info > span:nth-child(3)').text(),
            image_url:$(list).find('.track ').attr('src'),
            locate: $(list).find('#info > span:nth-child(4)').text()
        };
        
        
        downloadFile.downloadFile(`https://cyclonicwx.com${$(list).find('.track ').attr('src')}`,function(){
          console.log('download success');
        });
      });

      

      resolve(trackImageList);
      
    });
    
    this.cycloneDataList = await CycloneDataList;  

    // 브라우저를 종료한다.
    await this.browser.close();
    
    return CycloneDataList;

  };
  

  GetFnmocData = async(url, callFunc ) => {

    
    this.cycloneDataList.forEach( async (element,index) => {


      console.log(element);
      //$('#StormList a:contains(96S)')
      const name = element.title.split(' ');
      const lastname = name[1];

      await this.init(url+'?STORM_NAME='+lastname+'.INVEST');

      // await Promise.all[ this.page.click( "#StormList a:contains("+lastname+")" ),  this.page.waitForNavigation( )];

      // this.page.click( "#ssmis-6 > a" );	// SSMIS 96GHZ 이미지 검색
      // this.page.waitForNavigation( );	// 해당 페이지의 탐색이 완료되면 클릭 이벤트를 실행

      console.log('바보');
        await Promise.all[ this.page.click( "#ssmis-6 > a" ),  this.page.waitForNavigation( )];
      console.log('멍청이');
      
      this.content= await this.page.content();
      
      const $ = cheerio.load(this.content); 
      console.log($('#TcMenu > table:nth-child(3) > tbody > tr:nth-child(3) > th > a > img').attr('src'));
      this.cycloneDataList.infraredImage = $('#TcMenu > table:nth-child(3) > tbody > tr:nth-child(3) > th > a > img').attr('src');
      
    });
    
    //return CycloneDataList;

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

exports.GetStormInfo = CrawlingClass.GetStormInfo;
exports.GetFnmocData = CrawlingClass.GetFnmocData;
  //exports.GetStormInfo = CrawlingClass.GetStormInfo('https://cyclonicwx.com/storms/');
  //exports.GetFnmocData = CrawlingClass.GetFnmocData('https://www.fnmoc.navy.mil/tcweb/cgi-bin/tc_home.cgi/');

  
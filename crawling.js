const axios = require("axios");
const cheerio = require("cheerio");

const puppeteer = require('puppeteer');

//#region 사이트별 약어 소개

//TropicalTidibits : TD
//cyclonicwx : CWX

//#endregion


//#region GetHtml


CWXHtmlParse = (async() => {
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

    // 페이지의 HTML을 가져온다.
    const content = await page.content();
    // $에 cheerio를 로드한다.
    const $ = cheerio.load(content);
    // 복사한 리스트의 Selector로 리스트를 모두 가져온다.
    const lists = $(".curtracks");
    let trackImageList = [];
    console.log(lists);
    // 모든 리스트를 순환한다.
    lists.each((index, list) => {
        console.log($(list).find('#info > span:nth-child(3)').text());
        console.log($(list).find('#info > span:nth-child(4)').text());

        trackImageList[index] = {
            title: $(list).find('#info > span:nth-child(3)').text(),
            image_url:$(list).find('.track ').attr('src'),
            locate: $(list).find('#info > span:nth-child(4)').text()
        };
        
    });
    // 브라우저를 종료한다.
    browser.close();

    return trackImageList;

  })();



/**
 * 
 * 현재 진행중인 열대성저기압의 정보를 가져온다.
 * (FROM TropicalTidibits)
 * 
 * @returns 
 */
const getHtmlFromTD = async () => {
    try {
      return await axios.get("https://www.tropicaltidbits.com/storminfo/");
    } catch (error) {
        console.error('TropicalTidibits에서 데이터 조회 실패');
      console.error(error);
    }
  };


  
/**
 * 
 * 현재 진행중인 열대성저기압의 정보를 가져온다.
 * (FROM cyclonicwx)
 * 
 * @returns 
 */
const getHtmlFromCWX = async () => {
    try {
      return await axios.get("https://cyclonicwx.com/storms/");
    } catch (error) {
      console.error('cyclonicwx에서 데이터 조회 실패');
      console.error(error);
    }
  };


//   const CWXHtmlParse = getHtmlFromCWX().then(  async CWXHtml => {

//     let trackImageList = [];
//     const $ = cheerio.load(CWXHtml.data);
//     const $tsList = $("#al15");

//     console.log($tsList);
    

//     $tsList.each(function(i, elem) {
//       trackImageList[i] = {
//           title: $(this).find('#info > span:nth-child(3)').text(),
//           image_url:$(this).find('#div:nth-child(3) > img ').attr('src'),
//           locate: $(this).find('#info > span:nth-child(4)').text(),
//       };
//     });

//     console.log(trackImageList);

//     const data = trackImageList.filter(n => n.title);
//     return data;
//   }).then(res => console.log(res));

    
  exports.getHtmlFromTD = getHtmlFromTD;
  exports.getHtmlFromCWX = getHtmlFromCWX;
  exports.CWXHtmlParse = CWXHtmlParse;


  
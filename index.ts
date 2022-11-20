// Used to download pages
import request from "request-promise";
import cheerio from "cheerio";

const url = "https://sfbay.craigslist.org/sby/sof/7558943157.html";

async function scrapeCraigsList() {
  try {
    const htmlResult = await request.get(url);
  } catch (error: any) {
    console.log(error.message);
  }
}

scrapeCraigsList();

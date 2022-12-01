// Used to download pages
import request from "request-promise";
// Adding a proxy
import fs from "fs";
const usedRequest = request.defaults({
  proxy: "173.245.49.41:80",
});
// Alternative
import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Listing from "./models/Listing.js";
import { finalResult, firstResult } from "./models/Listing.js";
import sleep from "./sleep.js";

dotenv.config();

async function connectToMongoDB() {
  const MongoDBURI = process.env.MONGODB_URI ? process.env.MONGODB_URI : "";
  await mongoose.connect(MongoDBURI);
  console.log("connected to mongodb");
}

// Doesn't work on this URL as Craigslist detects that we'ren't using a browser
// const url = "https://sfbay.craigslist.org/search/sby/sof#search=1~thumb~0~0";

const scrapeResults: firstResult[] = [];
const finalResults: finalResult[] = [];
const url2 = "https://bangkok.craigslist.org/search/jjj?areaAbb=bangkok";

async function scrapeJobHeader() {
  try {
    const query = await request.get(
      `http://api.scraperapi.com/?api_key=${process.env.SCRAPE_API_KEY}&url=${url2}`
      // url2
    );
    // console.log(query);
    // console.log(query.response);
    const htmlResult = query && query;
    // console.log(htmlResult);
    const $ = await cheerio.load(htmlResult);
    // console.log($(".titlestring"));
    // console.log($(".cl-result-info"));
    // console.log($(".thumb-result-container"));
    $(".result-info").each(function (i, e) {
      // console.log(i);
      const resultTitle = $(e)
        .children(".result-heading")
        .children(".result-title");
      // .find(".titlestring")
      // .text();
      const title = resultTitle.text();
      let url: string = resultTitle.attr("href")!;
      const foundDate = $(e).children(".result-date").attr("datetime")!;
      const datePosted: Date = new Date(foundDate)!;
      const neighborhood = $(e)
        .find(".result-hood")
        .text()
        .trim()
        .replace("(", "")
        .replace(")", "");
      // console.log(neighborhood);
      const scrapeResult: firstResult = {
        title,
        url,
        datePosted,
        neighborhood,
      };
      scrapeResults.push(scrapeResult);
    });
    console.log(scrapeResults);
    return scrapeResults;
  } catch (error: any) {
    console.log(error.message);
    return scrapeResults;
  }
}

// async function scrapeDescription(jobWithHeaders: firstResult[]) {
//   await Promise.all(
//     jobWithHeaders.map(async (e, i) => {
//       try {
//         // console.log(`First phase: ${i}`);
//         let searchedURL = `http://api.scraperapi.com/?api_key=${process.env.SCRAPE_API_KEY}&url=${e.url}`;
//         const htmlResult = await request.get(searchedURL);
//         // console.log(`Second phase: ${i}`);
//         const $ = await cheerio.load(htmlResult);
//         // $(".print-qrcode-container").remove() to remove an element from the page
//         $(".print-qrcode-container").remove();
//         // $("#postingbody").text() to get the content
//         e.jobDescription = $("#postingbody").text();
//         // children().first() to select the first child
//         let compensation = $(".attrgroup").children().first().text();
//         e.compensation = compensation.replace("compensation: ", "");
//         // console.log(e);
//         console.log(e);
//         return e;
//       } catch (error) {
//         console.error(error);
//         await sleep(1000);
//       }
//     })
//   );
// }

async function scrapeDescription(jobWithHeaders: firstResult[]) {
  for (let i = 0; i < jobWithHeaders.length; i++) {
    sleep(1000);
    try {
      const { title, url, datePosted, neighborhood } = jobWithHeaders[i];
      // console.log(`First phase: ${i}`);
      let searchedURL = `http://api.scraperapi.com/?api_key=${process.env.SCRAPE_API_KEY}&url=${url}`;
      const htmlResult = await request.get(searchedURL);
      // console.log(`Second phase: ${i}`);
      const $ = await cheerio.load(htmlResult);
      // $(".print-qrcode-container").remove() to remove an element from the page
      $(".print-qrcode-container").remove();
      // $("#postingbody").text() to get the content
      let jobDescription = $("#postingbody").text();
      // children().first() to select the first child
      let compensation = $(".attrgroup").children().first().text();
      compensation = compensation.replace("compensation: ", "");
      // console.log(e);
      const newresult = {
        title,
        datePosted,
        neighborhood,
        url,
        jobDescription,
        compensation,
      };
      console.log(newresult);
      finalResults.push(newresult);
    } catch (error) {
      console.error(error);
      await sleep(1000);
    }
  }
}

async function scrapeCraigsList() {
  const jobWithHeaders: firstResult[] = await scrapeJobHeader();
  await sleep(1000);
  await scrapeDescription(jobWithHeaders);
  console.log(finalResults);
}

// scrapeJobHeader();
scrapeCraigsList();

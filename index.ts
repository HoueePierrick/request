// Used to download pages
import request from "request-promise";
// Alternative
import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Listing from "./models/Listing.js";
import { oneResult } from "./models/Listing.js";
import sleep from "./sleep.js";

dotenv.config();

async function connectToMongoDB() {
  const MongoDBURI = process.env.MONGODB_URI ? process.env.MONGODB_URI : "";
  await mongoose.connect(MongoDBURI);
  console.log("connected to mongodb");
}

// Doesn't work on this URL as Craigslist detects that we'ren't using a browser
// const url = "https://sfbay.craigslist.org/search/sby/sof#search=1~thumb~0~0";

const scrapeResults: any[] = [];
const url2 = "https://bangkok.craigslist.org/search/jjj?areaAbb=bangkok";

async function scrapeJobHeader() {
  try {
    const query = await request.get(
      `http://api.scraperapi.com/?api_key=${process.env.SCRAPE_API_KEY}&url=${url2}`
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
      const url = resultTitle.attr("href");
      const foundDate = $(e).children(".result-date").attr("datetime");
      const datePosted = foundDate && new Date(foundDate);
      const neighborhood = $(e)
        .find(".result-hood")
        .text()
        .trim()
        .replace("(", "")
        .replace(")", "");
      console.log(neighborhood);
      const scrapeResult = { title, url, datePosted, neighborhood };
      scrapeResults.push(scrapeResult);
    });
    // console.log(scrapeResults);
    return scrapeResults;
  } catch (error: any) {
    console.log(error.message);
  }
}

async function scrapeDescription(jobWithHeaders: any[]) {
  await Promise.all(
    jobWithHeaders.map(async (e, i) => {
      sleep(1000);
      const htmlResult = await request.get(e.url);
      const $ = await cheerio.load(htmlResult);
      // $(".print-qrcode-container").remove() to remove an element from the page
      $(".print-qrcode-container").remove();
      // $("#postingbody").text() to get the content
      e.jobDescription = $("#postingbody").text();
      return e;
    })
  );
}

async function scrapeCraigsList() {
  const jobWithHeaders = await scrapeJobHeader();
  const jobFullData =
    jobWithHeaders && (await scrapeDescription(jobWithHeaders));
  console.log(jobFullData);
}

scrapeCraigsList();

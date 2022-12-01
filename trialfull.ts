// Used to download pages
import request from "request-promise";
import cheerio from "cheerio";
import dotenv from "dotenv";
import Listing from "./models/Listing.js";
import { oneResult } from "./models/Listing.js";
import sleep from "./sleep.js";

dotenv.config();

// List of failing URLs

const failingURLs = [
  "https://bangkok.craigslist.org/edu/d/wanted-teacher-physic-and-chemistry/7561172225.html",
  "https://bangkok.craigslist.org/ofc/d/small-design-company-requires-secretary/7561804360.html",
  "https://bangkok.craigslist.org/edu/d/it-teacher-16-classes-per-week/7561834500.html",
];

async function scrapeDescription(url: string) {
  try {
    sleep(1000);
    const htmlResult = await request.get(url);
    const $ = await cheerio.load(htmlResult);
    $(".print-qrcode-container").remove();
    let jobDescription = $("#postingbody").text();
    let compensation = $(".attrgroup").children().first().text();
    compensation = compensation.replace("compensation: ", "");
    console.log({ jobDescription, compensation });
    return { jobDescription, compensation };
  } catch (error) {
    console.error(error);
  }
}

scrapeDescription(failingURLs[0]);

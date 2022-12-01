// Used to download pages
import request from "request-promise";
import cheerio from "cheerio";
import dotenv from "dotenv";
import sleep from "./sleep";

dotenv.config();

// List of failing URLs

const failingURL =
  "https://bangkok.craigslist.org/edu/d/wanted-teacher-physic-and-chemistry/7561172225.html";
async function scrapeDescription(url) {
  try {
    sleep(1000);
    const htmlResult = await request.get(url);
    console.log(htmlResult);
  } catch (error) {
    console.error(error);
  }
}

scrapeDescription(failingURLs[0]);

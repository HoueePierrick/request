// Used to download pages
import request from "request-promise";
// Alternative
import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Listing from "./models/Listing.js";
import { oneResult } from "./models/Listing.js";

dotenv.config();

async function connectToMongoDB() {
  const MongoDBURI = process.env.MONGODB_URI ? process.env.MONGODB_URI : "";
  await mongoose.connect(MongoDBURI);
  console.log("connected to mongodb");
}

const url = "https://sfbay.craigslist.org/search/sby/sof#search=1~thumb~0~0";

async function scrapeCraigsList() {
  try {
    const query: any = await request.get(url);
    // console.log(query.response);
    const htmlResult = query && query;
    // console.log(htmlResult);
    const $ = await cheerio.load(htmlResult);
    // console.log($(".cl-result-info"));
    $(".cl-result-info").map((i, e) => {
      console.log(i);
      const title = $(e)
        // .children(".title-blob")
        // .children(".titlestring")
        .find(".titlestring")
        .text();
      console.log(title);
    });
  } catch (error: any) {
    console.log(error.message);
  }
}

scrapeCraigsList();

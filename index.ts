// Used to download pages
import request from "request-promise";
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

const url = "https://sfbay.craigslist.org/sby/sof/7558943157.html";

async function scrapeCraigsList() {
  try {
    const htmlResult = await request.get(url);
    // console.log(htmlResult);
    const $ = cheerio.load(htmlResult);
  } catch (error: any) {
    console.log(error.message);
  }
}

scrapeCraigsList();

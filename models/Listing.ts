// TO DO = add address field

import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface firstResult {
  title: string;
  datePosted: Date;
  neighborhood: string;
  url: string;
  jobDescription?: string;
  compensation?: string;
}

export interface finalResult {
  title: firstResult["title"];
  datePosted: firstResult["datePosted"];
  neighborhood: firstResult["neighborhood"];
  url: firstResult["url"];
  jobDescription: string;
  compensation: string;
}

export interface oneResult extends Document {
  title: finalResult["title"];
  datePosted: finalResult["datePosted"];
  neighborhood: finalResult["neighborhood"];
  url: finalResult["url"];
  jobDescription: finalResult["jobDescription"];
  compensation: finalResult["compensation"];
}

const listingSchema = new Schema<oneResult>({
  title: String,
  datePosted: Date,
  neighborhood: String,
  url: String,
  jobDescription: String,
  compensation: String,
});

const Listing = mongoose.model("listings", listingSchema);

export default Listing;

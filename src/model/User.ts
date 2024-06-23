import mongoose, { Schema, Document } from "mongoose";
//document for tssefty

export interface Messgae extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Messgae> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

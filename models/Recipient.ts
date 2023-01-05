import {Schema, Model, Types, } from "mongoose";

export interface Recipient {
    _id: Types.ObjectId,
    email: string,
    responded: boolean,
    uuid: string;
}

const recipientSchema = new Schema<Recipient>({
  email: {
    type: String,
    required: true
  },
  responded: {
      type: Boolean,
      default: false
  },
  uuid: {
    type: String,
    required: true
  }
});



export default recipientSchema;
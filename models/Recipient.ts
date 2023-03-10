import mongoose, {Schema, Types, Model, HydratedDocument } from "mongoose";

export interface Recipient {
    _id: Types.ObjectId,
    email: string,
    responded: boolean,
    uuid: string;
    choice: string;
    sent: boolean;
    survey: Types.ObjectId;
    createdAt: string;
    updatedAt: string;
}

interface RecipientMethods {
  toJSON: () => Omit<Recipient, 'uuid'>
}

type RecipientModel = Model<Recipient, {}, RecipientMethods>;

const recipientSchema = new Schema<Recipient, RecipientModel, RecipientMethods>({
  email: {
    type: String,
    required: true
  },
  responded: {
      type: Boolean,
      default: false
  },
  choice: {
    type: String,
    default: ''
  },
  uuid: {
    type: String,
    required: true
  },
  sent: {
    type: Boolean,
    required: true
  },
  survey: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Survey'
  }
}, {
  timestamps: true
});


recipientSchema.method('toJSON', function(this: HydratedDocument<Recipient>) {
  const {uuid, ...obj} = this.toObject();
  return obj;
})

//@ts-ignore
export default (mongoose.models.Recipient as RecipientModel) || mongoose.model<Recipient, RecipientModel>('Recipient', recipientSchema);
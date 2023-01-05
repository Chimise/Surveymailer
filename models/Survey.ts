import mongoose, {Schema, Types, Model} from "mongoose";
import recipientSchema, {Recipient} from "./Recipient";

interface Survey {
    title: string;
    body: string;
    subject: string;
    recipients: Array<Recipient>;
    yes: number,
    no: number,
    user: Types.ObjectId,
    dateSent: Date,
    lastResponded: Date
}


const surveySchema = new Schema<Survey>({
    title: String,
    body: String,
    subject: String,
    recipients: [recipientSchema],
    yes: {
        type: Number,
        default: 0
    },
    no: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    dateSent: Date,
    lastResponded: Date

});

//@ts-ignore
export default (mongoose.model.Survey as Model<Survey>) || mongoose.model<Survey>('Survey', surveySchema);
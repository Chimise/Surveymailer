import mongoose, {Schema, Types, Model} from "mongoose";

interface Choices {
    _id: Types.ObjectId;
    action: string;
    responses: number;
    code: number;
}

export interface Survey {
    title: string;
    body: string;
    subject: string;
    shipper: string;
    recipients: number;
    shipper_email?: string;
    choices: Types.DocumentArray<Choices>,
    user: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}



const surveySchema = new Schema<Survey>({
    title: {
        type: String,
        required: true
    },
    shipper: {
        type: String,
        required: true
    },
    shipper_email: String,
    body: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    recipients: {
        type: Number,
        default: 0
    },
    choices: [new Schema({
        action: {
            type: String,
            required: true
        },
        responses: {
            type: Number,
            default: 0
        },
        code: {
            type: Number,
            required: true
        }
    })],
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
});

//@ts-ignore
export default (mongoose.models.Survey as Model<Survey>) || mongoose.model<Survey>('Survey', surveySchema);
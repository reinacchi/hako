import { model, Schema } from "mongoose";

export interface Entry {
    author: string;
    content: string;
    desc: string;
    id: string;
    tags: string[];
    title: string;
    date: Date;
}

const entriesSchema = new Schema<Entry>({
    author: {
        type: Schema.Types.String,
        required: true,
    },
    content: {
        type: Schema.Types.String,
        required: true,
    },
    desc: {
        type: Schema.Types.String,
        required: true,
    },
    id: {
        type: Schema.Types.String,
        required: true
    },
    tags: {
        type: [Schema.Types.String],
        required: true,
    },
    title: {
        type: Schema.Types.String,
        required: true,
    },
    date: {
        type: Schema.Types.Date,
        required: true,
    },
});

export const Entries = model<Entry>("entries", entriesSchema);

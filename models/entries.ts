import { model, Schema } from "mongoose";
import { type Comment } from "~/types/comment";

export interface Entry {
    author: string;
    comments: Comment[];
    content: string;
    desc: string;
    id: string;
    tags: string[];
    title: string;
    date: Date;
}

const entriesSchema = new Schema<Entry>({
    author: { type: String, required: true },
    comments: { type: [{ type: Schema.Types.Mixed, ref: "Comment" }], default: [] },
    content: { type: String, required: true },
    desc: { type: String, required: true },
    id: { type: String, required: true },
    tags: { type: [String], default: [] },
    title: { type: String, required: true },
    date: { type: Date, default: new Date() },
});

export const Entries = model("entries", entriesSchema);

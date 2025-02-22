import { Entries, type Entry } from "~/models/entries";

export default defineEventHandler(async (event) => {
    const entryID = getRouterParam(event, "entry") as string;
    const entry = await Entries.findOne({ id: entryID }) as Entry;

        if (!entry) {
            return {
                code: 404,
                message: "Unknown Entry"
            }
        } else {
            return {
                author: entry.author,
                comments: entry.comments,
                content: entry.content,
                date: entry.date,
                desc: entry.desc,
                id: entry.id,
                tags: entry.tags,
                title: entry.title,
            };
        }
});

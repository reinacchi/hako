import { Entries, type Entry } from "~/models/entries";

export default defineEventHandler(async () => {
    const rawEntries: Entry[] = await Entries.find({});
    const entries = rawEntries.map((entry) => {
        return {
            author: entry.author,
            date: entry.date,
            desc: entry.desc,
            id: entry.id,
            tags: entry.tags,
            title: entry.title,
        };
    });

    return entries;
});

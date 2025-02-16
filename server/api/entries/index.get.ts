import { Entries, type Entry } from "~/models/entries";

export default defineEventHandler(async () => {
    const entries: Entry[] = await Entries.find({});

    return entries;
});

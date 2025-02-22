import { Entries } from "~/models/entries";

export default defineEventHandler(async (event) => {
    const entryID = getRouterParam(event, "entry") as string;
    const entry = await Entries.findOne({ id: entryID });

        if (!entry) {
            return {
                code: 404,
                message: "Unknown Entry"
            }
        } else {
            return entry;
        }
});

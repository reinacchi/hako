import { Entries } from "~/models/entries";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const entryID = getRouterParam(event, "entry") as string;
    const authHeader = getHeader(event, "Authorisation");
    const config = useRuntimeConfig();

    if (authHeader !== config.Auth) {
        console.error("Unauthorised");
        return;
    }

    const entry = await Entries.findOne({ id: entryID });

    if (!entry) {
        console.error("Entry not found");
        return;
    }

    entry.comments.push({
        name: body.name,
        text: body.text,
        date: new Date(),
    });

    await entry.save();
});

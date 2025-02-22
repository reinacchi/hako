import { Entries } from "~/models/entries";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const authHeader = getHeader(event, "Authorisation");
    const config = useRuntimeConfig();

    if (authHeader !== config.Auth) {
        console.error("Unauthorised");
    } else {
        await Entries.create({
            author: body.author,
            comments: [],
            content: body.content,
            date: new Date(),
            desc: body.description,
            id: body.title.toLowerCase().replaceAll(" ", "-").replaceAll("'", "").replaceAll(",", ""),
            tags: body.tags,
            title: body.title,
        });
    }
});

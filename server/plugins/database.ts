import mongoose from "mongoose";


export default defineNitroPlugin(async () => {
    const config = useRuntimeConfig();
    mongoose.set("strictQuery", false);

    await mongoose.connect(config.MongoDB)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error(err));
});
import mongoose from "mongoose";


export default defineNitroPlugin(async () => {
    const config = useRuntimeConfig();
    mongoose.set("strictQuery", false);

    await mongoose.connect(config.MongoDB, {
        connectTimeoutMS: 30000,
        socketTimeoutMS: 60000,
    })
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error(err));
});
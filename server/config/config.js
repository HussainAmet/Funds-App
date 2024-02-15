import dotenv from "dotenv";
import "esm";
dotenv.config();

const config = {
    mongodUri: String(process.env.MONGOD_SERVER_URI),
    port: process.env.PORT,
}

export default config;
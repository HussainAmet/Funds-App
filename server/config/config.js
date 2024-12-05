import dotenv from "dotenv";
import "esm";
dotenv.config();

const config = {
    mongodUri: String(process.env.MONGOD_SERVER_URI),
    port: process.env.PORT,
    requestBaseUrl: String(process.env.REQUEST_BASE_URL),
    productionUrl: String(process.env.PRODUCTION_URL),
}

export default config;

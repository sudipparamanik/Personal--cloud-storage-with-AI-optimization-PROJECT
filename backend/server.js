require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
connectDB();

app.listen(5000, () => {
    console.log("server is running");
});

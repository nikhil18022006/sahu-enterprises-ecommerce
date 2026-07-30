const mongoose = require("mongoose");

const uri =
"mongodb+srv://sahuadmin:Sahu1802@cluster0.bgn75b2.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

async function test() {
    try {
        console.log("Connecting...");
        await mongoose.connect(uri);
        console.log("✅ Connected Successfully!");
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

test();
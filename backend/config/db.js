const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

async function connect() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'Chatty'
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        throw error;
    }
}

module.exports = { connect };
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const certPath = path.resolve(__dirname, '../certs/certificate.pem'); // Adjust the path to your certificate

const connectDB = async (username, password) => {
    try {
        await mongoose.connect(`mongodb+srv://${username}:${password}@rdpb-db1.y2d93em.mongodb.net/?retryWrites=true&w=majority&appName=RDPB-DB1`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { con: null, promise: null };
}

/**
 * Establishes a connection to the MongoDB database.
 * 
 * This function uses a cached connection if available to avoid creating multiple connections
 * during subsequent requests in a serverless environment.
 * 
 */
async function dbConnect() {
    if (cached.con) {
        // Verbindung existiert bereits, zurückgeben
        return cached.con;
    }

    if (!cached.promise) {
        // local db
        // const uri = 'mongodb://localhost:27017/contact-log-db';
        //atlas mongodb
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error("Die MONGODB_URI Umgebungsvariable ist nicht definiert.");
        }

        const options = {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(uri, options).then(mongoose => {
            return mongoose;
        }).catch((err: unknown) => {
            console.error("Fehler beim Verbinden mit der MongoDB", err);
            throw new Error(String(err)); 
        });
    }

    cached.con = await cached.promise;
    return cached.con;
}

/**
 * disconnect from mongo database
 * 
 */
async function dbDisconnect() {
    if (cached.con) {
        try {
            await mongoose.disconnect();
            cached.con = null; // Caching zurücksetzen
        } catch (err: unknown) {
            console.error("Fehler beim Trennen der DB-Verbindung", err);
        }
    }
}

const mongodb = { dbConnect, dbDisconnect };
export default mongodb;

import dns from "node:dns";
import mongoose from "mongoose";

// Примусово використовуємо Google DNS, щоб уникнути блокування SRV-записів (querySrv ECONNREFUSED)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Підключення до MongoDB (Atlas) через Mongoose
export async function connectDB(uri) {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("Підключено до MongoDB");
  } catch (error) {
    console.error("Помилка підключення до MongoDB:", error.message);
    process.exit(1);
  }
}
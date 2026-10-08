import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./services/db.js";
import trackRoutes from "./routes/trackRoutes.js";

// .env шукаємо поруч із цим файлом, а не в поточній теці запуску
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Логування методу й адреси кожного запиту
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Тестовий маршрут
app.get("/", (req, res) => {
  res.send("Сервер аудіоплеєра Wavely працює");
});

app.use("/api/tracks", trackRoutes);

// Рядок підключення береться лише з .env (паролі не зберігаємо в коді)
if (!process.env.MONGO_URI) {
  console.error("Не знайдено MONGO_URI.");
  console.error(`Сервер шукав файл: ${envPath}`);
  if (fs.existsSync(envPath)) {
    const keys = Object.keys(dotenv.parse(fs.readFileSync(envPath)));
    console.error(`Файл існує, але ключі в ньому такі: ${JSON.stringify(keys)}. Потрібен ключ MONGO_URI.`);
    console.error("Перевірте, що рядок має вигляд MONGO_URI=... (без лапок і пробілів) і файл збережено в UTF-8 без BOM.");
  } else {
    console.error("За цим шляхом файлу немає.");
    const similar = fs.readdirSync(__dirname).filter((f) => f.toLowerCase().includes("env"));
    console.error(`Файли зі схожою назвою в цій теці: ${JSON.stringify(similar)}`);
  }
  process.exit(1);
}

await connectDB(process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});

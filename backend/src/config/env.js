import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/applywizz",
  corsOrigin: (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim()),
  datasetPath: process.env.DATASE_PATH || "data/Jobs_Dataset.xlsx",
  duplicateSimilarityThreshold: parseFloat(
    process.env.DUPLICATE_SIMILARITY_THRESHOLD || "0.82"
  ),
};

export { config };

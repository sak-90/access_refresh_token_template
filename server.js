import express from "express";
import dotenv from "dotenv";
import connect from "./utils/connectDatabase.js";
import router from "./routes/userRoutes.js";

dotenv.config();
await connect();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/user", router);

app.listen(PORT, () => {
  console.log(`Server working on port ${PORT}`);
});

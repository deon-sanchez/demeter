import ExpressConfig from "./config/express.config";
import todoRouter from "./routes/todoRouter";
import { PORT } from "./config/env";
import connectDB from "./config/mongo.config";

connectDB();
const app = ExpressConfig();

app.use("/api", todoRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
});

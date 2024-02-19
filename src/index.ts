import mongoose from "mongoose";
import ExpressConfig from "./config/express.config";
import todoRouter from "./routes/todoRouter";
import { MONGO_URI, PORT } from "./config/env";

mongoose.connect(MONGO_URI).then(() => {
  console.log(`connected to database ${MONGO_URI}`);
});
const app = ExpressConfig();

app.use("/", todoRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

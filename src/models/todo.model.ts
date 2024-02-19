import mongoose, { Schema } from "mongoose";
import iTodo from "../interfaces/iTodo";

const todoSchema = new Schema<iTodo>({
  _id: {
    type: Schema.Types.UUID,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const TodoModel = mongoose.model("Todo", todoSchema);

export { TodoModel };

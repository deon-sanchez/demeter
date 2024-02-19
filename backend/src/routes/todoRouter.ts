import express from "express";
import {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";

const todoRouter = express.Router();

todoRouter.get("/", listTodos);
todoRouter.get("/:id", getTodo);
todoRouter.post("/", createTodo);
todoRouter.put("/:id", updateTodo);
todoRouter.delete("/:id", deleteTodo);

export default todoRouter;

import { Request, Response } from "express";
import { TodoModel } from "../models/todo.model";
import iTodo from "../interfaces/iTodo";

export const getTodo = async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const todo = (await TodoModel.findById(id)) as iTodo;

    if (!todo) {
      return res.status(404).send({ message: "Todo not found" });
    }

    res.status(200).send(todo);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const listTodos = async (_req: Request, res: Response) => {
  try {
    const todoList = (await TodoModel.find()) as iTodo[];

    if (todoList) {
      res.status(200).send(todoList);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const todoData = req.body as iTodo;

    const todo = new TodoModel(todoData);
    const savedTodo = await todo.save();

    res.status(201).send(savedTodo);
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error) {
      if ("name" in error && error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }

      res.status(500).send({ message: error.message });
    } else {
      res.status(500).send({ message: "An unknown error occurred" });
    }
  }
};

export const deleteTodo = async (_req: Request, res: Response) => {
  try {
    const _id = _req?.params?.id;
    const result = await TodoModel.findByIdAndDelete(_id);

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const _id = req?.params?.id;
    const todo = req.body as iTodo;

    const result = await TodoModel.findByIdAndUpdate(_id, todo, { new: true });

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

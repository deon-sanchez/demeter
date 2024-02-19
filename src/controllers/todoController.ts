import { Request, Response } from "express";
import { TodoModel } from "../models/todo.model";
import iTodo from "../interfaces/iTodo";

export const getTodo = async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const todo = (await TodoModel.findById(id)) as iTodo;

    if (todo) {
      res.status(200).send(todo);
    }
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
    const todo = req.body.content as iTodo;

    const result = new TodoModel({ todo });

    if (result) {
      await result.save();
      res.status(201).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
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

export const updateTodo = async (_req: Request, res: Response) => {
  try {
    const _id = _req?.params?.id;
    const todo = _req.body as iTodo;

    const result = await TodoModel.findByIdAndUpdate(_id, todo);

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

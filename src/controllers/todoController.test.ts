import { Request, Response } from "express";
import { TodoModel } from "../models/todo.model";
import {
  getTodo,
  listTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "./todoController";

jest.mock("../models/todo.model");

describe("getTodo", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: {
        id: "123",
      },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send the todo if found", async () => {
    const todo = { id: "123", title: "Test Todo", completed: false };
    (TodoModel.findById as jest.Mock).mockResolvedValue(todo);

    await getTodo(req, res);

    expect(TodoModel.findById).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(todo);
  });

  it("should send a 404 if todo is not found", async () => {
    (TodoModel.findById as jest.Mock).mockResolvedValue(null);

    await getTodo(req, res);

    expect(TodoModel.findById).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: "Todo not found" });
  });

  it("should send an error if an exception occurs", async () => {
    const error = new Error("Database error");
    (TodoModel.findById as jest.Mock).mockRejectedValue(error);

    await getTodo(req, res);

    expect(TodoModel.findById).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(error);
  });
});

describe("listTodos", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send the list of todos if found", async () => {
    const todoList = [
      { id: "1", title: "Todo 1", completed: false },
      { id: "2", title: "Todo 2", completed: true },
    ];
    (TodoModel.find as jest.Mock).mockResolvedValue(todoList);

    await listTodos(req, res);

    expect(TodoModel.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(todoList);
  });

  it("should send an empty array if no todos are found", async () => {
    (TodoModel.find as jest.Mock).mockResolvedValue([]);

    await listTodos(req, res);

    expect(TodoModel.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([]);
  });

  it("should send an error if an exception occurs", async () => {
    const error = new Error("Database error");
    (TodoModel.find as jest.Mock).mockRejectedValue(error);

    await listTodos(req, res);

    expect(TodoModel.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(error);
  });
});

describe("createTodo", () => {
  // Mock request and response objects
  let mockReq: Partial<Request>, mockRes: Partial<Response>;

  beforeEach(() => {
    // Reset mocks before each test case
    mockReq = { body: { title: "Test Todo", completed: false } };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("should create a todo and respond with 201 status code", async () => {
    // Arrange
    TodoModel.prototype.save = jest.fn().mockResolvedValue(mockReq.body);

    // Act
    await createTodo(mockReq as Request, mockRes as Response);

    // Assert
    expect(TodoModel.prototype.save).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.send).toHaveBeenCalledWith(mockReq.body);
  });

  it("should handle errors and respond with 500 status code", async () => {
    // Arrange
    const errorMessage = { message: "Database error" };
    TodoModel.prototype.save = jest.fn().mockRejectedValue(errorMessage);

    // Act
    await createTodo(mockReq as Request, mockRes as Response);

    // Assert
    expect(TodoModel.prototype.save).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });

  it("responds with 400 for ValidationError", async () => {
    // Arrange
    const validationError = new Error("Validation failed");
    validationError.name = "ValidationError";
    TodoModel.prototype.save = jest.fn().mockRejectedValue(validationError);

    // Act
    await createTodo(mockReq as Request, mockRes as Response);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: "Validation failed",
    });
  });

  it("responds with 500 for generic errors", async () => {
    // Arrange
    const genericError = new Error("Something went wrong");
    TodoModel.prototype.save = jest.fn().mockRejectedValue(genericError);

    // Act
    await createTodo(mockReq as Request, mockRes as Response);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: "Something went wrong",
    });
  });
});

describe("deleteTodo", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: {
        id: "123",
      },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete the todo if found", async () => {
    const result = { id: "123", title: "Test Todo", completed: false };
    (TodoModel.findByIdAndDelete as jest.Mock).mockResolvedValue(result);

    await deleteTodo(req, res);

    expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(result);
  });

  it("should not delete anything if todo is not found", async () => {
    (TodoModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await deleteTodo(req, res);

    expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it("should send an error if an exception occurs", async () => {
    const error = new Error("Database error");
    (TodoModel.findByIdAndDelete as jest.Mock).mockRejectedValue(error);

    await deleteTodo(req, res);

    expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(error);
  });
});

describe("updateTodo", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: {
        id: "123",
      },
      body: {
        title: "Updated Todo",
        completed: true,
      },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update the todo if found", async () => {
    const updatedTodo = { id: "123", title: "Updated Todo", completed: true };
    (TodoModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTodo);

    await updateTodo(req, res);

    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith("123", req.body, {
      new: true,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(updatedTodo);
  });

  it("should send an error if an exception occurs", async () => {
    const error = new Error("Database error");
    (TodoModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);

    await updateTodo(req, res);

    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith("123", req.body, {
      new: true,
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(error);
  });
});

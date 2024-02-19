import { Types } from "mongoose";

interface iTodo {
  _id: Types.UUID;
  title: string;
  completed: boolean;
}

export default iTodo;

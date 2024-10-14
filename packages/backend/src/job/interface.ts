import {DAO} from "@/db/dao";
import {ConnectionOptions, RedisConnection} from "bullmq";

type TaskType = string

interface TaskContext {
  dao: DAO | ((...args: any[]) => DAO),
  queue: Queue | ((...args: any[]) => Queue),
}
export type Connection = ConnectionOptions
export type Task = {
  id: number;
  type: TaskType;
  ctx: TaskContext
  data: any
}

export interface JobQueue {
  createTask(task: Task): void
}

interface EmailTask extends Task {
  id: number;
  type: 'email';
  data: {
    sendTo: string;
    from: string;
    content: string;
  }
}

interface RefreshTask extends Task {
  id: number;
  type: 'token-refresh';
  data: {

  }
}

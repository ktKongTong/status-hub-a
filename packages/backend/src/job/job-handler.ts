import { Job, Queue, Worker } from "bullmq";
import {Connection} from "@/job/interface";

export abstract class JobHandler<T> {
  name: string
  queue: Queue
  workers: Worker[] = []
  abstract handler(job: Job<T>): Promise<any>
  constructor(name: string, conn: Connection) {
    this.name = name;
    this.queue = new Queue(this.name, {connection: conn})
    this.workers = [new Worker(this.name, this.handler.bind(this), {connection: conn})]
  }
}



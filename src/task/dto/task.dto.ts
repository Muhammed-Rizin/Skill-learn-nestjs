export interface Task {
  user: string;
  task: string;
  description: string;
  endTime: Date;
}

export interface CompleteTask {
  from: string;
  to: string;
  task: string;
  description: string;
  endTime: string;
  completed: boolean;
}

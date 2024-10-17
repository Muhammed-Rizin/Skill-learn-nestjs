export interface Schedule {
  user: string;
  topic: string;
  description: string;
  time: Date;
}

export interface CompleteSchedule {
  from: string;
  to: string;
  time: string;
  topic: string;
  description: string;
  completed: boolean;
}

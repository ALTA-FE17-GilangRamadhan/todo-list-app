export type TasksType = {
  creatorId: string;
  createdAt: string;
  assigneeId: string;
  assignerId: string;
  commentCount: number;
  isCompleted: boolean;
  content: string;
  description: string;
  due: {
    date: string;
    isRecurring: boolean;
    datetime: string;
    string: string;
    timezone: string;
  };
  duration: number;
  id: string;
  labels: string[];
  order: number;
  priority: number;
  projectId: string;
  sectionId: string;
  parentId: string;
  url: string;
};

export interface CardProps {
  content: string;
  isCompleted: boolean;
  completed?: React.MouseEventHandler;
  incomplete?: React.MouseEventHandler;
  detail?: React.MouseEventHandler;
  update?: React.MouseEventHandler;
  deleteTask?: React.MouseEventHandler;
}

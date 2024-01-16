import { FC } from "react";
import { CardProps } from "../utils/todoist";

const Cards: FC<CardProps> = ({ content, isCompleted, detail, update, completed, incomplete, deleteTask }) => {
  return (
    <div>
      <div className="card w-96 bg-base-100 shadow-sm rounded-md">
        <div className="card-body p-3">
          {isCompleted ? (
            <h2 className="card-title line-clamp-1 line-through text-gray-400">{content}</h2>
          ) : (
            <h2 className="card-title line-clamp-1 cursor-pointer hover:text-yellow-400" onClick={detail}>
              {content}
            </h2>
          )}
          {isCompleted ? (
            <div className="card-actions justify-end">
              <button onClick={incomplete} className="badge badge-warning">
                Incomplete
              </button>
              <button onClick={deleteTask} className="badge badge-error">
                Delete
              </button>
            </div>
          ) : (
            <div className="card-actions justify-end">
              <button onClick={completed} className="badge badge-success">
                Complete
              </button>
              <button onClick={update} className="badge badge-warning">
                Edit
              </button>
              <button onClick={deleteTask} className="badge badge-error">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cards;

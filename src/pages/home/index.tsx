import { FormEvent, useEffect, useState } from "react";
import { withRouter } from "../../withRouter";
import Cards from "../../components/Cards";
import { TodoistApi } from "@doist/todoist-api-typescript";
import { TasksType } from "../../utils/todoist";
import axios from "axios";
import Swal from "sweetalert2";

const Home = () => {
  const token = import.meta.env.VITE_ACCESS_TOKEN;
  const api = new TodoistApi(`${token}`);
  const [datas, setDatas] = useState<[] | any>([]);
  const [detail, setDetail] = useState<TasksType | any>({
    creatorId: "",
    createdAt: "",
    assigneeId: "",
    assignerId: "",
    commentCount: 0,
    isCompleted: false,
    content: "",
    description: "",
    due: {
      date: "",
      isRecurring: false,
      datetime: "",
      string: "",
      timezone: "",
    },
    duration: 0,
    id: "",
    labels: [""],
    order: 0,
    priority: 0,
    projectId: "",
    sectionId: "",
    parentId: "",
    url: "",
  });
  const [completed, setCompleted] = useState<[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [idTask, setIdTask] = useState<string>("");

  function getTasks() {
    api
      .getTasks()
      .then((tasks) => {
        setDatas(tasks);
      })
      .catch((error) => console.log(error));
  }

  function getDetailTask(id: string) {
    setShowModalDetail((prev) => !prev);
    api
      .getTask(id)
      .then((task) => {
        setDetail(task);
      })
      .catch((error) => console.log(error));
  }

  function handleCloseDetail() {
    setShowModalDetail((prev) => !prev);
    setDetail({});
  }

  function getCompletedTasks() {
    axios
      .get("https://api.todoist.com/sync/v9/completed/get_all", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCompleted(response.data.items);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleModalAdd() {
    setShowModal((prev) => !prev);
    setContent("");
    setDescription("");
    setDate("");
  }

  const addDataHandle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModal((prev) => !prev);
    setContent("");
    setDescription("");
    setDate("");
    api
      .addTask({
        content: content,
        description: description,
        due_date: date,
      })
      .then((task) => {
        console.log(task);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your task has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.log(error));
  };

  const updateDataHandle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModalUpdate((prev) => !prev);
    setContent("");
    setDescription("");
    setDate("");
    api
      .updateTask(`${idTask}`, {
        content: content,
        description: description,
        due_date: date,
      })
      .then((isSuccess) => {
        console.log(isSuccess);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your task has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.log(error));
  };

  function handleModalUpdate(id: string) {
    setShowModalUpdate((prev) => !prev);
    api
      .getTask(id)
      .then((task) => {
        console.log(task);
        setContent(task.content);
        setDescription(task.description);
        const dueDate = task.due != null ? task.due.date : "";
        setDate(dueDate);
        setIdTask(task.id);
      })
      .catch((error) => console.log(error));
  }

  function closeUpdate() {
    setShowModalUpdate((prev) => !prev);
    setContent("");
    setDescription("");
    setDate("");
  }

  function completeTasksHandle(id: string) {
    api
      .closeTask(id)
      .then((isSuccess) => {
        console.log(isSuccess);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your task has been completed",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.log(error));
  }

  function incompleteTasksHandle(id: string) {
    api
      .reopenTask(id)
      .then((isSuccess) => {
        console.log(isSuccess);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your task reopen",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.log(error));
  }

  function deleteTaskHandle(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .deleteTask(id)
          .then((isSuccess) => {
            console.log(isSuccess);
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          })
          .catch((error) => console.log(error));
      }
    });
  }

  useEffect(() => {
    getTasks();
    getCompletedTasks();
  }, [datas, completed]);

  return (
    <div className="bg-slate-300 absolute w-full">
      <div className="flex gap-5">
        <div className="p-5 bg-slate-600 w-2/5 mx-auto my-16 rounded-xl">
          <div className="flex justify-center items-center gap-3">
            <h1 className="text-2xl text-white my-3 text-center">ToDo List</h1>
            <button onClick={() => setShowModal((prev) => !prev)} className="badge badge-primary my-4">
              Add Data
            </button>
          </div>
          <div className="h-screen overflow-scroll hidden-scroll">
            <div className="grid grid-flow-row auto-rows-max gap-3 justify-items-center">
              {datas &&
                datas.map((item: any, index: number) => {
                  return (
                    <Cards
                      key={index}
                      content={item.content}
                      isCompleted={false}
                      completed={() => completeTasksHandle(item.id)}
                      detail={() => getDetailTask(item.id)}
                      update={() => handleModalUpdate(item.id)}
                      deleteTask={() => deleteTaskHandle(item.id)}
                    />
                  );
                })}
            </div>
          </div>
        </div>
        <div className="p-5 bg-slate-600 w-2/5 mx-auto my-16 rounded-xl">
          <h1 className="text-2xl text-white my-3 text-center">Completed</h1>
          <div className="h-screen overflow-scroll hidden-scroll">
            <div className="grid grid-flow-row auto-rows-max gap-3 justify-items-center">
              {completed &&
                completed.map((item: any, index: number) => {
                  return <Cards key={index} content={item.content} isCompleted={true} incomplete={() => incompleteTasksHandle(item.task_id)} deleteTask={() => deleteTaskHandle(item.task_id)} />;
                })}
            </div>
          </div>
        </div>
      </div>
      {showModal ? (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 bg-white p-6 rounded-lg">
            <h1 className="text-2xl text-center my-5">Add Task</h1>
            <form onSubmit={addDataHandle}>
              <div className="my-2">
                <input type="text" placeholder="Content" value={content} onChange={(e: any) => setContent(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div className="my-2">
                <textarea className="textarea textarea-bordered w-full" value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="Description"></textarea>
              </div>
              <div className="my-2">
                <label htmlFor="date">Due Date: </label>
                <input type="date" name="date" id="date" className="bg-slate-100 p-3" value={date} onChange={(e: any) => setDate(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary float-end mx-2">
                Add
              </button>
              <button onClick={() => handleModalAdd()} className="btn btn-error text-white float-end mx-2">
                Cancel
              </button>
            </form>
          </div>
        </div>
      ) : (
        <></>
      )}

      {showModalDetail ? (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 bg-white p-6 rounded-lg">
            <h1 className="text-2xl text-center my-5">Detail</h1>
            <div>
              <div>
                <h2 className="text-2xl font-bold">{detail.content}</h2>
                <p>{detail.description}</p>
                {detail.due != null && <p>Due To: {detail.due.date}</p>}
              </div>
              <button onClick={() => handleCloseDetail()} className="btn btn-error text-white float-end mx-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {showModalUpdate ? (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 bg-white p-6 rounded-lg">
            <h1 className="text-2xl text-center my-5">Add Task</h1>
            <form onSubmit={updateDataHandle}>
              <div className="my-2">
                <input type="text" placeholder="Content" value={content} onChange={(e: any) => setContent(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div className="my-2">
                <textarea className="textarea textarea-bordered w-full" value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="Description"></textarea>
              </div>
              <div className="my-2">
                <label htmlFor="date">Due Date: </label>
                <input type="date" name="date" id="date" className="bg-slate-100 p-3" value={date} onChange={(e: any) => setDate(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary float-end mx-2">
                Edit
              </button>
              <button onClick={() => closeUpdate()} className="btn btn-error text-white float-end mx-2">
                Cancel
              </button>
            </form>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default withRouter(Home);

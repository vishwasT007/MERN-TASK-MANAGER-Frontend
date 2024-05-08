import { toast } from "react-toastify";
import Task from "./Task";
import TaskForm from "./TaskForm";
import axios from "axios";
import { URL } from "../App";
import { useState, useEffect } from "react";
import loadingImg from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formInputData, setFormInputData] = useState({
    name: "",
    completed: false,
  });

  const [isEditing, setIsEditing] = useState(false);

  const [taskId, setTaskId] = useState("");

  const { name } = formInputData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputData({ ...formInputData, [name]: value });
  };

  const getTasks = async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.get(`${URL}/api/tasks`);
      console.log(data);
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    // console.log(formInputData)
    if (name === "") {
      return toast.error("Input field cannot be empty");
    }

    try {
      await axios.post(`${URL}/api/tasks`, formInputData);
      toast.success("Task Added Successfully");
      setFormInputData({ ...formInputData, name: "" });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const completedTask = tasks.filter((task) => {
        return task.completed === true;
    })
    setCompletedTasks(completedTask)
  }, [tasks])

  const getSingleTask = async (task) => {
    setFormInputData({ name: task.name, completed: false });
    setTaskId(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if(name === "") {
        return toast.error("Input Field cannot be empty")
    }

    try {
        await axios.put(`${URL}/api/tasks/${taskId}`, formInputData);
        setFormInputData({ ...formInputData, name : ""})
        setIsEditing(false);
        getTasks();
    } catch (error) {
        toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const newFormData = {
        name : task.name,
        completed : true
    }

    try {
        await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
        getTasks();

    } catch (error) {
        toast.error(error.message);
    } 
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}

      />

    {tasks.length > 0 && (
        <div className="--flex-between --pb">
        <p>
          <b>Total Task :</b> {tasks.length}
        </p>

        <p>
          <b>Completed Task :</b> {completedTasks.length}
        </p>
      </div>
    )}
      
      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loadingImg} alt="Loading" />
        </div>
      )}

      {!isLoading && tasks.length === 0 ? (
        <p className="--py">NO Task Added, Please Add a Task</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask = {getSingleTask}
                setToComplete = {setToComplete}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;

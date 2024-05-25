import { Checkbox, ListItemText, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import {
  validateDate,
  validateTaskDivision,
  validateTaskPeople,
  validateTaskPriority,
  validateTaskTitle,
} from "../utils/validations";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { taskActions } from "../store/taskSlice";
import { uiActions } from "../store/uiSlice";
import { createActivity, getDatasFromAxios } from "../utils";
import axios from "axios";
import { firebaseRealtimeDatabaseURL } from "../constants";
import Loading from "../components/Loading";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const CreateTask = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("-1");
  const [division, setDivision] = useState("-1");
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [titleError, setTitleError] = useState(null);
  const [priorityError, setPriorityError] = useState(null);
  const [divisionError, setDivisionError] = useState(null);
  const [selectedPeopleError, setSelectedPeopleError] = useState(null);
  const [dateError, setDateError] = useState(null);

  const navigate = useNavigate();

  const handlePeopleChange = (e) => {
    setSelectedPeople(e.target.value);
    setSelectedPeopleError(validateTaskPeople(e.target.value));
  };

  const handleCreateTask = () => {
    if (
      title === "" ||
      priority === "-1" ||
      division === "-1" ||
      selectedPeople.length === 0 ||
      startDate === "" ||
      endDate === ""
    ) {
      if (title === "") {
        setTitleError("Title is required");
      }

      if (priority === "-1") {
        setPriorityError("Choose priority level");
      }

      if (division === "-1") {
        setDivisionError("Choose division");
      }

      if (selectedPeople.length === 0) {
        setSelectedPeopleError("Select participant");
      }

      if (startDate === "" || endDate === "") {
        setDateError("Enter valid date range");
      }

      return;
    }

    if (
      titleError ||
      priorityError ||
      divisionError ||
      selectedPeopleError ||
      dateError
    ) {
      return;
    }

    // firebase
    setLoading(true);

    const newTask = {
      title,
      description,
      priority: priority,
      division,
      people: [user.id, ...selectedPeople],
      startDateTime: startDate,
      endDateTime: endDate,
      completed: false,
      completedBy: null,
      createdBy: user.id,
      createdAt: new Date(),
    };

    axios
      .post(`${firebaseRealtimeDatabaseURL}/tasks.json`, newTask)
      .then(async (res) => {
        if (res.data) {
          dispatch(taskActions.addTask({ id: res.data.name, ...newTask }));

          dispatch(
            uiActions.setNotification({
              type: "success",
              message: "New task created!",
              open: true,
            }),
          );

          await createActivity(user.id, `created "${title}" task.`);

          setLoading(false);

          return navigate("/");
        }
      })
      .catch((err) => console.log(err));

    // // insert into database
    // const newTask = {
    //   id: Math.ceil(Math.random() * 999) + 100,
    //   title,
    //   description,
    //   priority: priority,
    //   division,
    //   people: [user.id, ...selectedPeople],
    //   startDateTime: startDate,
    //   endDateTime: endDate,
    //   completed: false,
    //   completedBy: null,
    //   createdBy: user.id,
    //   createdAt: new Date(),
    // };

    // const existingTasksJSON = localStorage.getItem("tasks");
    // const existingTasks = existingTasksJSON
    //   ? JSON.parse(existingTasksJSON)
    //   : [];

    // existingTasks.push(newTask);
    // localStorage.setItem("tasks", JSON.stringify(existingTasks));

    // dispatch(taskActions.addTask(newTask));

    // dispatch(
    //   uiActions.setNotification({
    //     type: "success",
    //     message: "New task created!",
    //     open: true,
    //   }),
    // );

    // createActivity(user.id, `created "${title}" task.`);

    // return navigate("/");
  };

  useEffect(() => {
    const getDivisions = async () => {
      setDivisions(await getDatasFromAxios("divisions"));
    };
    getDivisions();

    const getUsers = async () => {
      setUsers(await getDatasFromAxios("users"));
    };
    getUsers();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="mx-10 mt-5 flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Create New Task</h1>

      <div className="flex justify-center gap-5 rounded-xl bg-blue-50/50 p-10">
        {/* left section */}
        <div className="flex w-[700px] flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Title</label>
            <input
              className="rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
              type="text"
              id="title"
              autoComplete="off"
              placeholder="Eg: Meet with John"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError(validateTaskTitle(e.target.value));
              }}
            />

            {titleError && <p className="text-xs text-red-600">{titleError}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="priority">Priority</label>
            <select
              className="rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
              id="priority"
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPriorityError(validateTaskPriority(e.target.value));
              }}
            >
              <option value="-1">Choose Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {priorityError && (
              <p className="text-xs text-red-600">{priorityError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="division">Division</label>
            <select
              className="rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
              id="division"
              value={division}
              onChange={(e) => {
                setDivision(e.target.value);
                setDivisionError(validateTaskDivision(e.target.value));
              }}
            >
              <option value="-1">Choose Division</option>
              {divisions.map((item, idx) => (
                <option key={idx} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {divisionError && (
              <p className="text-xs text-red-600">{divisionError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="people">People</label>
            <Select
              id="people"
              multiple
              sx={{
                height: "50px",
                borderRadius: "8px",
                backgroundColor: "white",
                ":hover": {
                  outline: "none",
                },
              }}
              value={selectedPeople}
              onChange={handlePeopleChange}
              renderValue={(selected) =>
                selected
                  .map((item) => users.find((item2) => item2.id === item).name)
                  .join(", ")
              }
              MenuProps={MenuProps}
            >
              {users
                ?.filter((item) => item.id !== user.id)
                .map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    <Checkbox checked={selectedPeople.indexOf(item.id) > -1} />
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
            </Select>

            {selectedPeopleError && (
              <p className="text-xs text-red-600">{selectedPeopleError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description</label>
            <textarea
              className="resize-none rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* right section */}
        <div className="flex flex-col justify-between">
          {/* date forms */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="startDate">Start Date</label>
              <input
                className="rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
                type="datetime-local"
                id="startDate"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDateError(validateDate(e.target.value, endDate));
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="endDate">End Date</label>
              <input
                className="rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
                type="datetime-local"
                id="endDate"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDateError(validateDate(startDate, e.target.value));
                }}
              />

              {dateError && <p className="text-xs text-red-600">{dateError}</p>}
            </div>
          </div>

          {/* create button */}
          <PrimaryButton
            cname={"justify-center"}
            handleClick={handleCreateTask}
          >
            Create Task
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;

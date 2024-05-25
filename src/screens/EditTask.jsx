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
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/uiSlice";
import { format } from "date-fns";
import { taskActions } from "../store/taskSlice";
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

const EditTask = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.auth.user);
  const tasks = useSelector((state) => state.task.tasks);
  const dispatch = useDispatch();

  const task = tasks.find((item) => item.id == id);

  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [title, setTitle] = useState(task?.title);
  const [priority, setPriority] = useState(task?.priority);
  const [division, setDivision] = useState(task?.division);
  const [selectedPeople, setSelectedPeople] = useState(task?.people.slice(1));
  const [description, setDescription] = useState(task?.description);
  const [startDate, setStartDate] = useState(
    format(task?.startDateTime, "yyyy-MM-dd") +
      "T" +
      format(task?.startDateTime, "HH:mm"),
  );
  const [endDate, setEndDate] = useState(
    format(task?.endDateTime, "yyyy-MM-dd") +
      "T" +
      format(task?.endDateTime, "HH:mm"),
  );
  const [loading, setLoading] = useState(true);

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

  const handleEditTask = async () => {
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

    const updatedTask = {
      title,
      description,
      priority: priority.toLowerCase(),
      division,
      people: [task?.people[0], ...selectedPeople],
      startDateTime: startDate,
      endDateTime: endDate,
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    await axios
      .post(`${firebaseRealtimeDatabaseURL}/tasks/${id}.json`, updatedTask)
      .then(async (res) => {
        if (res.data) {
          dispatch(taskActions.modifyTask({ id: id, properties: updatedTask }));

          dispatch(
            uiActions.setNotification({
              type: "success",
              message: "Task updated!",
              open: true,
            }),
          );

          // check if title is updated
          if (task.title !== updatedTask.title) {
            await createActivity(
              user.id,
              `updated task title from "${task.title}" to "${updatedTask.title}".`,
            );
          }

          await createActivity(
            user.id,
            `updated the details of "${updatedTask.title}" task.`,
          );

          setLoading(false);

          return navigate(-1);
        }
      })
      .catch((err) => console.log(err));

    // local storage
    // const existingTasksJSON = localStorage.getItem("tasks");
    // const existingTasks = existingTasksJSON
    //   ? JSON.parse(existingTasksJSON).map((item) => {
    //       if (item.id == task?.id) {
    //         return {
    //           ...item,
    //           title,
    //           description,
    //           priority: priority.toLowerCase(),
    //           division,
    //           people: [task?.people[0], ...selectedPeople],
    //           startDateTime: startDate,
    //           endDateTime: endDate,
    //           updatedBy: user.id,
    //           updatedAt: new Date(),
    //         };
    //       }

    //       return item;
    //     })
    //   : [];

    // localStorage.setItem("tasks", JSON.stringify(existingTasks));
    // dispatch(taskActions.replaceTasks(existingTasks));

    // dispatch(
    //   uiActions.setNotification({
    //     type: "success",
    //     message: "Task updated!",
    //     open: true,
    //   }),
    // );

    // const existingTask = existingTasks.find((item) => item.id == task?.id);

    // createActivity(
    //   user.id,
    //   `updated the details of "${existingTask?.title}" task?.`,
    // );

    // // check if title is updated
    // if (task?.title !== existingTask?.title) {
    //   createActivity(
    //     user.id,
    //     `updated task title from "${task?.title}" to "${existingTask?.title}".`,
    //   );
    // }

    // return navigate(-1);
  };

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      setDivisions(await getDatasFromAxios("divisions"));
      setUsers(await getDatasFromAxios("users"));
    };
    fetchData().finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="mx-10 flex h-full flex-col justify-center gap-5">
      <h1 className="text-2xl font-bold">Edit Task</h1>

      <div className="flex justify-center gap-5 rounded-xl bg-blue-50 p-10">
        {/* left section */}
        <div className="flex w-[700px] flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Title</label>
            <input
              className="rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
              type="text"
              id="title"
              autoComplete="off"
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
                  .map((item) => users.find((item2) => item2.id === item)?.name)
                  .join(", ")
              }
              MenuProps={MenuProps}
            >
              {users
                ?.filter((item) => item.id != task?.people[0])
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
          <PrimaryButton cname={"justify-center"} handleClick={handleEditTask}>
            Update Task
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default EditTask;

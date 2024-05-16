import { useEffect, useState } from "react";
import { projectTypes } from "../data";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/uiSlice";
import IconLabel from "../components/IconLabel";
import { projectActions } from "../store/projectSlice";
import {
  validateDeadline,
  validateProjectName,
  validateProjectType,
  validateTaskPeople,
} from "../utils/validations";
import {
  Checkbox,
  FormControlLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { format } from "date-fns";
import { createActivity } from "../utils";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const EditProject = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.project.projects);
  const dispatch = useDispatch();

  const project = projects.find((item) => item.id == id);

  const [users, setUsers] = useState([]);
  const [projectName, setProjectName] = useState(project.projectName);
  const [deadline, setDeadline] = useState(
    format(project.deadline, "yyyy-MM-dd") +
      "T" +
      format(project.deadline, "HH:mm"),
  );
  const [projectType, setProjectType] = useState(project.projectType);
  const [selectedPeople, setSelectedPeople] = useState(project.people.slice(1));
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState(project.status);

  const [projectNameError, setProjectNameError] = useState(null);
  const [deadlineError, setDeadlineError] = useState(null);
  const [projectTypeError, setProjectTypeError] = useState(null);
  const [selectedPeopleError, setSelectedPeopleError] = useState(null);

  const navigate = useNavigate();

  const handlePeopleChange = (e) => {
    setSelectedPeople(e.target.value);
    setSelectedPeopleError(validateTaskPeople(e.target.value));
  };

  const handleEditProject = () => {
    if (
      projectName === "" ||
      deadline === "" ||
      projectType === "-1" ||
      selectedPeople.length === 0
    ) {
      if (projectName === "") {
        setProjectNameError("Title is required");
      }

      if (deadline === "") {
        setDeadlineError("Enter a deadline");
      }

      if (projectType === "-1") {
        setProjectTypeError("Choose project type");
      }

      if (selectedPeople.length === 0) {
        setSelectedPeopleError("Select participant");
      }

      return;
    }

    if (
      projectNameError ||
      deadlineError ||
      projectTypeError ||
      selectedPeopleError
    ) {
      return;
    }

    // update database
    const existingProjectsJSON = localStorage.getItem("projects");
    const existingProjects = existingProjectsJSON
      ? JSON.parse(existingProjectsJSON)
      : [];
      
    const existingProject = existingProjects.find(
      (item) => item.id == project.id,
    );
    const existingProjectUpdated = {
      ...existingProject,
      projectName,
      deadline,
      projectType,
      people: [project.people[0], ...selectedPeople],
      description,
      status,
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    const existingProjectsUpdated = existingProjects.map((item) => {
      if (item.id == project.id) {
        return { ...item, ...existingProjectUpdated };
      }

      return item;
    });

    localStorage.setItem("projects", JSON.stringify(existingProjectsUpdated));

    dispatch(projectActions.replaceProjects(existingProjectsUpdated));

    dispatch(
      uiActions.setNotification({
        type: "success",
        message: "Project updated!",
        open: true,
      }),
    );

    createActivity(
      user.id,
      `updated the details of "${existingProjectUpdated.projectName}" project.`,
    );

    // check if title is updated
    if (existingProject.projectName !== existingProjectUpdated.projectName) {
      createActivity(
        user.id,
        `changed project name of "${existingProject.projectName}" to "${existingProjectUpdated.projectName}".`,
      );
    }

    // check if status is updated
    if (existingProject.status !== existingProjectUpdated.status) {
      createActivity(
        user.id,
        `changed project status of "${existingProjectUpdated.projectName}" from "${existingProject.status}" to "${existingProjectUpdated.status}".`,
      );
    }

    return navigate(-1);
  };

  useEffect(() => {
    setUsers(
      localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : [],
    );
  }, []);

  return (
    <div className="mt-5 flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Edit Project</h1>

      <div className="flex justify-center gap-10 rounded-xl bg-blue-50/50 p-10">
        {/* left section */}
        <div className="flex w-[700px] flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="projectName">Project Name</label>
            <input
              className="rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
              type="text"
              id="projectName"
              autoComplete="off"
              placeholder="Eg: Library App"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setProjectNameError(validateProjectName(e.target.value));
              }}
            />

            {projectNameError && (
              <p className="text-xs text-red-600">{projectNameError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="deadline">Project Deadline</label>
            <input
              className="rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
              type="datetime-local"
              id="deadline"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                setDeadlineError(validateDeadline(e.target.value));
              }}
            />

            {deadlineError && (
              <p className="text-xs text-red-600">{deadlineError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="projectType">Project Type</label>
            <select
              className="rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
              id="projectType"
              value={projectType}
              onChange={(e) => {
                setProjectType(e.target.value);
                setProjectTypeError(validateProjectType(e.target.value));
              }}
            >
              <option value="-1">Choose Project Type</option>
              {projectTypes.map((item, idx) => (
                <option key={idx} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {projectTypeError && (
              <p className="text-xs text-red-600">{projectTypeError}</p>
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
                .filter((item) => item.id !== user.id)
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
          {/* project status checkboxes */}
          <div className="flex flex-col gap-3">
            {/* header */}
            <p>Project Status</p>

            <RadioGroup
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {/* checkboxes */}
              {["completed", "ongoing", "notstarted", "failed"].map(
                (item, idx) => (
                  <div className="flex items-center" key={idx}>
                    <FormControlLabel
                      value={item}
                      control={<Radio size="small" />}
                    />

                    <IconLabel
                      type={item}
                      cname={"-ml-3"}
                      iconSizePx={"20px"}
                      fontSizePx={"15px"}
                    />
                  </div>
                ),
              )}
            </RadioGroup>
          </div>

          {/* create button */}
          <PrimaryButton
            cname={"justify-center"}
            handleClick={handleEditProject}
          >
            Update Project
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default EditProject;

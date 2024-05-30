/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { format } from "date-fns";
import PrimaryButton from "../components/PrimaryButton";
import Person from "../components/Person";
import IconLabel from "../components/IconLabel";
import { useEffect, useState } from "react";
import { uiActions } from "../store/uiSlice";
import { deleteProject } from "../store/projectActions";
import { createActivity, getDatasFromAxios } from "../utils";
import Loading from "../components/Loading";

const ViewProject = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.project.projects);
  const project = projects.find((item) => item.id == id);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleDeleteProject = async () => {
    if (!confirm("Confirm delete project? (can not be undone)")) {
      return;
    }

    setLoading(true);

    if (await dispatch(deleteProject(id))) {
      await createActivity(
        user.id,
        `deleted "${project.projectName}" project.`,
      );
      return navigate("/");
    }
  };

  useEffect(() => {
    if (!project && !loading) {
      dispatch(
        uiActions.setNotification({
          type: "error",
          message: "Project not found!",
          open: true,
        }),
      );

      return navigate("/");
    }
  }, [project, navigate, dispatch, loading]);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      setProjectTypes(await getDatasFromAxios("projectTypes"));
      setUsers(await getDatasFromAxios("users"));
    };
    fetchData().finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading />
  ) : (
    project && (
      <div className="my-20 flex justify-center gap-20">
        {/* left section */}
        <div className="w-[600px]">
          {/* upper */}
          <div className="mb-7 flex flex-col gap-1">
            {/* title and edit button */}
            <div className="flex items-center justify-between gap-3">
              {/* title */}
              <h1 className="text-3xl font-bold">{project.projectName}</h1>

              {/* edit and delete button */}
              <div className="flex items-center gap-1">
                <PrimaryButton
                  cname={"py-2 w-fit self-end"}
                  href={`/projects/${project.id}/edit`}
                >
                  Edit
                </PrimaryButton>

                <PrimaryButton
                  cname={"py-2 w-fit self-end bg-red-700 hover:bg-red-600"}
                  handleClick={handleDeleteProject}
                >
                  Delete
                </PrimaryButton>
              </div>
            </div>

            {/* duration and priority */}
            <div className="flex flex-col text-sm">
              {project?.updatedBy && (
                <p className="text-xs text-gray-600">
                  Last edited by{" "}
                  {users.find((item) => item.id == project.updatedBy)?.name} at{" "}
                  {format(project.updatedAt, "d MMM y (hh:mm:ss aa)")}
                </p>
              )}

              <p className="mt-3">
                {format(
                  new Date(project.deadline),
                  "eee, dd MMM yyyy, HH:mm aa",
                )}
              </p>

              <p>
                Project Type:{" "}
                {
                  projectTypes.find((item) => item.id == project.projectType)
                    ?.name
                }
              </p>

              <div className="mt-3">
                <p>Status:</p>

                <IconLabel type={project.status} fontSizePx={"13px"} />
              </div>
            </div>
          </div>

          {/* lower */}
          <div className="rounded-lg bg-blue-100">
            <p className="p-5 text-justify leading-6 tracking-wide">
              {project.description
                ? project.description
                : "No description available."}
            </p>
          </div>
        </div>

        {/* right section */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold">Team</p>

          <Box
            component={Paper}
            elevation={3}
            className="flex w-[300px] flex-col gap-3 p-5"
            sx={{
              borderRadius: "10px",
            }}
          >
            {project.people.map((item, idx) => (
              <Person key={idx} id={item} idx={idx} type={"creator_label"} />
            ))}
          </Box>
        </div>
      </div>
    )
  );
};

export default ViewProject;

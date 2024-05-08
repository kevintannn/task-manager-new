/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { format } from "date-fns";
import PrimaryButton from "../components/PrimaryButton";
import { projectTypes, users } from "../data";
import Person from "../components/Person";
import IconLabel from "../components/IconLabel";

const ViewProject = () => {
  const { id } = useParams();

  const projects = useSelector((state) => state.project.projects);
  const project = projects.find((item) => item.id == id);

  return (
    <div className="my-20 flex justify-center gap-20">
      {/* left section */}
      <div className="w-[600px]">
        {/* upper */}
        <div className="mb-7 flex flex-col gap-1">
          {/* title and edit button */}
          <div className="flex items-center justify-between gap-3">
            {/* title */}
            <h1 className="text-3xl font-bold">{project.projectName}</h1>

            {/* edit button */}
            <PrimaryButton
              cname={"py-2 w-fit self-end"}
              type="link"
              href={`/projects/${project.id}/edit`}
            >
              Edit
            </PrimaryButton>
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
              {format(new Date(project.deadline), "eee, dd MMM yyyy, HH:mm aa")}
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
        <div className="rounded-lg bg-blue-50">
          <p className="p-5 text-justify leading-6 tracking-wide">
            {project.description}
          </p>
        </div>
      </div>

      {/* right section */}
      <div className="flex flex-col gap-5">
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
  );
};

export default ViewProject;

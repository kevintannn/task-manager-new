import ProjectsTable from "../components/ProjectsTable";
import ListLayout from "./layouts/ListLayout";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useSelector } from "react-redux";
import IconLabel from "../components/IconLabel";

const ProjectList = () => {
  const projects = useSelector((state) => state.project.projects);

  return (
    <ListLayout>
      <div className="flex flex-col gap-7">
        <div className="flex items-end justify-between">
          {/* header */}
          <h1 className="text-4xl font-bold">Project List</h1>

          <div className="flex items-center gap-5 text-xs text-gray-500">
            <IconLabel type="export" hoverable={true} />

            <IconLabel type="share" hoverable={true} />

            <div className="cursor-pointer">
              <MoreHorizIcon fontSize="large" className="" />
            </div>
          </div>
        </div>

        {/* projects */}
        {projects.length <= 0 ? (
          <div className="flex h-60 items-center justify-center rounded-xl bg-blue-100">
            <p>There is no project</p>
          </div>
        ) : (
          <ProjectsTable projects={projects} fontsize={"15px"} />
        )}
      </div>
    </ListLayout>
  );
};

export default ProjectList;

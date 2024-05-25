// import "react-calendar/dist/Calendar.css";
import AddIcon from "@mui/icons-material/Add";
import "../calendar.css";
import Card from "../components/Card";
import TopBar from "../components/TopBar";
import Calendar from "react-calendar";
import ActivityBox from "../components/ActivityBox";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import PrimaryButton from "../components/PrimaryButton";
import { useSelector } from "react-redux";
import ProjectsTable from "../components/ProjectsTable";
import IconLabel from "../components/IconLabel";
import { Modal } from "@mui/material";
import PaginationButtons from "../components/PaginationButtons";
import { getDatasFromAxios } from "../utils";
import Loading from "../components/Loading";

const Dashboard = () => {
  const tasks = useSelector((state) => state.task.tasks);
  const projects = useSelector((state) => state.project.projects);

  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().toDateString()),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [projectCurrentPage, setProjectCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const filteredTasks = tasks?.filter((item) => {
    const startDate = new Date(new Date(item.startDateTime).toDateString()); // the purpose of nesting new Date() is to set the hours to 00:00:00 so we only compare date
    const endDate = new Date(new Date(item.endDateTime).toDateString());

    if (startDate <= selectedDate && endDate >= selectedDate) {
      return item;
    }
  });

  const searchedTasks = filteredTasks?.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const searchedProjects = projects.filter((item) =>
    item.projectName.toLowerCase().includes(search.toLowerCase()),
  );

  const pageSize = 6;
  const totalPages = Math.ceil(searchedTasks?.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedTasks = searchedTasks?.slice(startIdx, startIdx + pageSize);

  const projectPageSize = 10;
  const projectTotalPages = Math.ceil(
    searchedProjects.length / projectPageSize,
  );
  const projectStartIdx = (projectCurrentPage - 1) * projectPageSize;
  const paginatedProjects = searchedProjects.slice(
    projectStartIdx,
    projectStartIdx + projectPageSize,
  );

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  useEffect(() => {
    setLoading(true);

    const getActivities = async () => {
      setActivities(await getDatasFromAxios("activities"));
    };
    getActivities().finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-col">
      <TopBar search={search} setSearch={setSearch} />

      {/* left and right section */}
      <div className="my-10 flex gap-5">
        {/* left section */}
        <div className="flex flex-1 flex-col gap-10">
          {/* left section one */}
          <div className="flex flex-col gap-5">
            {/* header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">
                {isToday
                  ? "Today's Task"
                  : "Task of " + format(selectedDate, "dd MMMM yyyy")}
              </h1>

              <PrimaryButton href={"/tasks/create"}>
                <AddIcon className="absolute -mt-0.5" fontSize="small" />
                <span className="ml-7 mr-1">Create New Task</span>
              </PrimaryButton>
            </div>

            {/* cards */}
            {searchedTasks?.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-4">
                  {paginatedTasks?.map((item, idx) => (
                    <Card key={idx} task={item} />
                  ))}
                </div>

                {/* pagination buttons */}
                <PaginationButtons
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              </div>
            )}

            {searchedTasks?.length <= 0 && (
              <div className="flex h-60 items-center justify-center rounded-xl bg-blue-100 text-gray-600">
                <p>There is no task</p>
              </div>
            )}
          </div>

          {/* left section two */}
          <div className="flex flex-col gap-3">
            {/* header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Projects</h1>

              <div className="flex items-center gap-5 text-xs">
                <IconLabel type="export" hoverable={true} />

                <IconLabel type="share" hoverable={true} />

                <PrimaryButton href={"/projects/create"}>
                  <AddIcon className="absolute -mt-0.5" fontSize="small" />
                  <span className="ml-7 mr-1">Create</span>
                </PrimaryButton>
              </div>
            </div>

            {/* table */}
            {projects.length <= 0 ? (
              <div className="flex h-60 items-center justify-center rounded-xl bg-blue-100 text-gray-600">
                <p>There is no project</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <ProjectsTable projects={paginatedProjects} />

                {/* pagination buttons */}
                <PaginationButtons
                  currentPage={projectCurrentPage}
                  setCurrentPage={setProjectCurrentPage}
                  totalPages={projectTotalPages}
                />
              </div>
            )}
          </div>
        </div>

        {/* right section */}
        <div className="flex w-[300px] flex-col gap-10">
          <Calendar onChange={(e) => setSelectedDate(new Date(e))} />

          <ActivityBox
            activities={activities.sort(
              (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
            )}
            limit={6}
            showModal={() => setModalVisible(true)}
          />
        </div>
      </div>

      {/* modal */}
      <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
        <div className="flex h-full w-full items-center justify-center">
          <ActivityBox
            cname={"bg-white max-h-[600px] overflow-y-auto"}
            activities={activities.sort(
              (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
            )}
            closeModal={() => setModalVisible(false)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;

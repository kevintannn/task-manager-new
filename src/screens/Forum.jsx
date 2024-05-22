import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PrimaryButton from "../components/PrimaryButton";
import { avatarImg } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { validateTitle } from "../utils/validations";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/uiSlice";
import { createActivity } from "../utils";
import TopBar from "../components/TopBar";

const Forum = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const navigate = useNavigate();

  const searchedDiscussions = discussions.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const createDiscussion = () => {
    if (title === "") {
      setTitleError("Title can not be empty!");
      return;
    }

    const existingDiscussionsJSON = localStorage.getItem("discussions");
    const existingDiscussions = existingDiscussionsJSON
      ? JSON.parse(existingDiscussionsJSON)
      : [];

    const newId = existingDiscussions?.[existingDiscussions.length - 1]
      ? parseInt(existingDiscussions?.[existingDiscussions.length - 1]?.id) + 1
      : 1;
    existingDiscussions.push({
      id: newId,
      title,
      content,
      upvotes: [],
      replies: [],
      createdBy: user.id,
      createdAt: new Date(),
    });

    localStorage.setItem("discussions", JSON.stringify(existingDiscussions));

    dispatch(
      uiActions.setNotification({
        type: "success",
        message: "New discussion created!",
        open: true,
      }),
    );

    createActivity(user.id, `created a new forum discussion.`);

    setModalVisible(false);
    setTitle("");
    setContent("");

    return navigate(0);
  };

  useEffect(() => {
    setUsers(
      localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : [],
    );

    setDiscussions(
      localStorage.getItem("discussions")
        ? JSON.parse(localStorage.getItem("discussions")).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )
        : [],
    );
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* top bar */}
      <TopBar
        placeholder="Search for question"
        search={search}
        setSearch={setSearch}
      />

      {/* content */}
      <div className="flex flex-col gap-5 pb-20">
        {/* header and button */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-3xl font-bold">Forum</p>

          <PrimaryButton handleClick={() => setModalVisible(true)}>
            Start a discussion
          </PrimaryButton>
        </div>

        {/* forum row */}
        <div className="flex flex-col gap-2">
          {searchedDiscussions.map((item, idx) => {
            let lastReplyUser = null;
            let lastReplyMessage = null;

            if (item.replies.length === 0) {
              lastReplyUser = users?.find(
                (item2) => item2.id == item.createdBy,
              )?.name;
              lastReplyMessage = `posted ${formatDistanceToNow(item.createdAt)} ago`;
            } else {
              const lastReply = item.replies[item.replies.length - 1];

              lastReplyUser = users?.find(
                (item2) => item2.id == lastReply.createdBy,
              )?.name;
              lastReplyMessage = `replied ${formatDistanceToNow(lastReply.createdAt)} ago`;
            }

            return (
              <Link
                key={idx}
                to={`/forum/${item.id}`}
                className="flex cursor-pointer items-center justify-between rounded-lg bg-blue-50 p-3 px-5 transition-all duration-150 hover:bg-blue-100"
              >
                {/* avatar, title, and time */}
                <div className="flex gap-5">
                  {/* image */}
                  <img
                    src={
                      users?.find((item2) => item2.id == item.createdBy)
                        ?.imgPath ?? avatarImg
                    }
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  {/* title and time */}
                  <div className="flex flex-col gap-1">
                    <p>{item.title}</p>
                    <p className="text-xs text-gray-700">
                      <span className="font-bold">{lastReplyUser}</span>{" "}
                      {lastReplyMessage}
                    </p>
                  </div>
                </div>

                {/* reply counter */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <ArrowCircleUpIcon
                      sx={{
                        fontSize: "27px",
                      }}
                    />
                    <p className="-mt-1">{item.upvotes.length}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <ChatBubbleOutlineIcon />
                    <p className="-mt-1">{item.replies.length}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* modal */}
        <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-[500px] flex-col gap-5 rounded-lg bg-white p-5">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Start a discussion</h1>

                <div
                  className="cursor-pointer"
                  onClick={() => setModalVisible(false)}
                >
                  <CloseIcon />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="title" className="text-sm">
                  Title
                </label>
                <input
                  type="text"
                  className="rounded-lg border border-gray-300 p-2 px-3 outline-none"
                  placeholder="Write your title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleError(validateTitle(e.target.value));
                  }}
                />

                {titleError && (
                  <p className="text-xs text-red-600">{titleError}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="title" className="text-sm">
                  Content
                </label>
                <textarea
                  rows={5}
                  className="resize-none rounded-lg border border-gray-300 p-2 px-3 outline-none"
                  placeholder="Describe your title (can be empty)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>

              <PrimaryButton
                cname={"justify-center"}
                handleClick={createDiscussion}
              >
                Create Discussion
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Forum;

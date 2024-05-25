import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ShareIcon from "@mui/icons-material/Share";
import { avatarImg, firebaseRealtimeDatabaseURL } from "../constants";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import PrimaryButton from "../components/PrimaryButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/uiSlice";
import { createActivity, getDatasFromAxios } from "../utils";
import axios from "axios";
import Loading from "../components/Loading";

const ViewForum = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [discussion, setDiscussion] = useState(null);
  const [reply, setReply] = useState("");
  const [toggleMore, setToggleMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleUpvote = async () => {
    // firebase
    await axios
      .get(`${firebaseRealtimeDatabaseURL}/discussions/${id}/upvotes.json`)
      .then(async (res) => {
        const upvotes = res.data || [];

        if (upvotes.includes(user.id)) {
          await axios
            .patch(`${firebaseRealtimeDatabaseURL}/discussions/${id}.json`, {
              upvotes: upvotes.filter((item) => item != user.id),
            })
            .then((res) => {
              if (res.data) {
                return navigate(0);
              }
            })
            .catch((err) => console.log(err));
        } else {
          await axios
            .patch(`${firebaseRealtimeDatabaseURL}/discussions/${id}.json`, {
              upvotes: [...upvotes, user.id],
            })
            .then((res) => {
              if (res.data) {
                return navigate(0);
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));

    // local storage
    // const existingDiscussionsJSON = localStorage.getItem("discussions");
    // const existingDiscussions = existingDiscussionsJSON
    //   ? JSON.parse(existingDiscussionsJSON).map((item) => {
    //       if (item.id == id) {
    //         const myUpvoteIdx = item.upvotes.findIndex(
    //           (item) => item == user.id,
    //         );

    //         if (myUpvoteIdx === -1) {
    //           item.upvotes.push(user.id);
    //         } else {
    //           item.upvotes = item.upvotes.filter((item) => item != user.id);
    //         }
    //       }

    //       return item;
    //     })
    //   : [];

    // localStorage.setItem("discussions", JSON.stringify(existingDiscussions));

    // return navigate(0);
  };

  const sendReply = async () => {
    if (reply === "") {
      return;
    }

    // firebase
    const newReply = {
      message: reply,
      createdBy: user.id,
      createdAt: new Date(),
    };

    await axios
      .post(
        `${firebaseRealtimeDatabaseURL}/discussions/${id}/replies.json`,
        newReply,
      )
      .then((res) => {
        if (res.data) {
          return navigate(0);
        }
      })
      .catch((err) => console.log(err));

    // local storage
    // const existingDiscussionsJSON = localStorage.getItem("discussions");
    // const existingDiscussions = existingDiscussionsJSON
    //   ? JSON.parse(existingDiscussionsJSON).map((item) => {
    //       if (item.id == id) {
    //         const newId = item.replies?.[item.replies.length - 1]
    //           ? parseInt(item.replies[item.replies.length - 1].id) + 1
    //           : 1;

    //         item.replies.push({
    //           id: newId,
    //           message: reply,
    //           createdBy: user.id,
    //           createdAt: new Date(),
    //         });
    //       }

    //       return item;
    //     })
    //   : [];

    // localStorage.setItem("discussions", JSON.stringify(existingDiscussions));

    // return navigate(0);
  };

  const deleteDiscussion = () => {
    if (!confirm("Confirm delete this discussion? (can not be undone)")) {
      return;
    }

    const existingDiscussionsJSON = localStorage.getItem("discussions");
    const existingDiscussions = existingDiscussionsJSON
      ? JSON.parse(existingDiscussionsJSON).filter((item) => item.id != id)
      : [];

    localStorage.setItem("discussions", JSON.stringify(existingDiscussions));

    dispatch(
      uiActions.setNotification({
        type: "success",
        message: "Sucessfully deleted a discussion!",
        open: true,
      }),
    );

    createActivity(user.id, `deleted a forum discussion.`);

    return navigate("/forum");
  };

  useEffect(() => {
    axios
      .get(`${firebaseRealtimeDatabaseURL}/discussions/${id}.json`)
      .then((res) => {
        if (res.data) {
          let data = { id, ...res.data };

          if (!res.data.upvotes) {
            data = { ...data, upvotes: [] };
          }

          if (!res.data.replies) {
            data = { ...data, replies: [] };
          } else {
            data = {
              ...data,
              replies: Object.keys(res.data.replies).map((item) => {
                return { id: item, ...res.data.replies[item] };
              }),
            };
          }

          setDiscussion(data);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    setLoading(true);

    const getUsers = async () => {
      setUsers(await getDatasFromAxios("users"));
    };
    getUsers().finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="mx-10 mt-5 flex flex-col gap-10 pb-20">
      {/* top box */}
      <div className="flex flex-col gap-5 rounded-xl p-10 shadow-lg">
        <Link
          to="/forum"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-100 transition-all duration-150 hover:bg-blue-50"
        >
          <ArrowBackIcon className="text-blue-700" />
        </Link>

        {/* avatar, name, and more button */}
        <div className="flex justify-between">
          {/* avatar and name */}
          <div className="flex items-center gap-5">
            {/* avatar */}
            <img
              src={
                users?.find((item) => item.id == discussion?.createdBy)
                  ?.imgPath ?? avatarImg
              }
              className="h-10 w-10 rounded-full object-cover"
            />

            {/* name and time */}
            <div className="flex flex-col">
              <p className="font-bold">
                {users?.find((item) => item.id == discussion?.createdBy)?.name}
              </p>
              <p className="text-xs text-gray-700">
                Posted{" "}
                {discussion?.createdAt &&
                  formatDistanceToNow(discussion?.createdAt)}{" "}
                ago
              </p>
            </div>
          </div>

          {/* more button */}
          <div className="relative">
            <div
              className="cursor-pointer"
              onClick={() => setToggleMore((prev) => !prev)}
            >
              <MoreHorizIcon className="text-gray-700 hover:text-gray-400" />
            </div>

            {toggleMore && (
              <div className="absolute right-0">
                <PrimaryButton
                  cname={"w-[150px] justify-center bg-red-700 hover:bg-red-600"}
                  handleClick={deleteDiscussion}
                >
                  Delete Discussion
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>

        {/* title */}
        <p className="text-2xl font-bold">{discussion?.title}</p>

        {/* content */}
        <p className="text-sm text-gray-700">{discussion?.content}</p>

        {/* informations and action buttons */}
        <div className="flex flex-col gap-3">
          {/* informations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ArrowCircleUpIcon className="text-green-600" />
              <p className="text-green-800">
                {discussion?.upvotes.length ?? 0}
              </p>
            </div>

            <p className="text-sm text-gray-700">
              {discussion?.replies.length ?? 0} replies
            </p>
          </div>

          {/* action buttons */}
          <div className="flex items-center justify-center gap-3">
            <div
              className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-300 ${discussion?.upvotes.findIndex((item) => item == user.id) !== -1 ? "bg-blue-50" : ""} p-2`}
              onClick={handleUpvote}
            >
              <KeyboardDoubleArrowUpIcon />
              <p className="text-sm font-semibold">
                {discussion?.upvotes.findIndex((item) => item == user.id) !== -1
                  ? "Upvoted"
                  : "Upvote"}
              </p>
            </div>

            <div className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-300 p-2">
              <ShareIcon fontSize="small" />
              <p className="text-sm font-semibold">Share</p>
            </div>
          </div>
        </div>
      </div>

      {/* reply box */}
      <div className="flex flex-col gap-3">
        <textarea
          placeholder="Write your reply..."
          rows={3}
          className="resize-none rounded-lg border border-gray-300 p-5 outline-none"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        ></textarea>

        <PrimaryButton cname={"self-end px-7"} handleClick={sendReply}>
          Send
        </PrimaryButton>
      </div>

      {/* bottom section */}
      <div className="flex flex-col gap-3">
        {/* header */}
        <p className="text-xl font-bold">Replies</p>

        {/* bottom box */}
        {1 === 1 && (
          <div className="flex flex-col gap-5 rounded-xl p-5 shadow-lg">
            {/* chats */}
            {discussion?.replies.length > 0 &&
              discussion?.replies
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    {/* reply */}
                    <div className="flex gap-5">
                      {/* avatar */}
                      <img
                        src={
                          users?.find((item2) => item2.id == item.createdBy)
                            ?.imgPath ?? avatarImg
                        }
                        className="h-10 w-10 rounded-full object-cover"
                      />

                      <div className="flex flex-col gap-2">
                        {/* name and time */}
                        <div className="flex flex-col">
                          <p className="font-bold">
                            {
                              users?.find((item2) => item2.id == item.createdBy)
                                ?.name
                            }
                          </p>
                          <p className="text-xs text-gray-700">
                            {item.createdAt &&
                              formatDistanceToNow(item.createdAt)}{" "}
                            ago
                          </p>
                        </div>

                        {/* content */}
                        <p className="text-sm text-gray-900">{item.message}</p>
                      </div>
                    </div>

                    {/* more icon */}
                    <div className="cursor-pointer">
                      <MoreHorizIcon className="text-gray-700 hover:text-gray-400" />
                    </div>
                  </div>
                ))}

            {discussion?.replies?.length === 0 && (
              <p className="text-gray-500">No reply</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewForum;

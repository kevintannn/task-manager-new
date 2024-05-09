import TopBar from "../components/TopBar";
import PrimaryButton from "../components/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/authSlice";
import { uiActions } from "../store/uiSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const formatFieldName = (fieldName) => {
  if (fieldName === "id") {
    return "ID";
  }

  if (fieldName === "contactNumber") {
    return "Contact Number";
  }

  const replacedUnderscores = fieldName.replace(/_/g, " ");
  const words = replacedUnderscores.split(" ");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

  return capitalizedWords.join(" ");
};

const Profile = () => {
  const { id } = useParams();

  const myself = useSelector((state) => state.auth.user);

  const [user, setUser] = useState({});

  const dispatch = useDispatch();

  const [divisions, setDivisions] = useState([]);
  const [divisionId, setDivisionId] = useState("");
  const [disableDivisionSelect, setDisableDivisionSelect] = useState(true);

  const navigate = useNavigate();

  const logout = () => {
    dispatch(authActions.logout());
    try {
      localStorage.removeItem("user");

      dispatch(
        uiActions.setNotification({
          type: "success",
          message: "You are logged out!",
          open: true,
        }),
      );
    } catch (error) {
      dispatch(
        uiActions.setNotification({
          type: "error",
          message: "Something went wrong.",
          open: true,
        }),
      );
    }
  };

  const editDivisionId = () => {
    const existingUsersJSON = localStorage.getItem("users");
    const existingUsers = existingUsersJSON
      ? JSON.parse(existingUsersJSON).map((item) => {
          if (item.id == user?.id) {
            return { ...item, divisionId };
          }

          return item;
        })
      : [];

    localStorage.setItem("users", JSON.stringify(existingUsers));

    // if user is myself
    if (!id) {
      const existingUser = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;

      existingUser.divisionId = divisionId;
      localStorage.setItem("user", JSON.stringify(existingUser));

      dispatch(authActions.changeDivisionId(divisionId));
    }

    dispatch(
      uiActions.setNotification({
        type: "success",
        message: "Division changed!",
        open: true,
      }),
    );

    setDisableDivisionSelect(true);
  };

  useEffect(() => {
    const usersJSON = localStorage.getItem("users");
    const users = usersJSON ? JSON.parse(usersJSON) : [];

    let user = myself;

    if (id) {
      const { password, ...userWithoutPassword } = users.find(
        (item) => item.id == id,
      );
      user = userWithoutPassword;
    }

    setUser(user);
    setDivisionId(user.divisionId);
  }, [id, myself]);

  useEffect(() => {
    if (id == myself.id) {
      return navigate("/profile");
    }
  }, [id, myself.id, navigate]);

  useEffect(() => {
    setDivisions(
      localStorage.getItem("divisions")
        ? JSON.parse(localStorage.getItem("divisions"))
        : [],
    );
  }, []);

  return (
    <div className="flex flex-col">
      <TopBar mode="only_profile" />

      <div className="flex justify-center gap-10">
        {/* profile */}
        <div className="flex w-fit flex-col gap-10 rounded-lg bg-blue-50 p-10">
          {/* image */}
          <img
            src={user?.imgPath}
            className="h-40 w-40 self-center rounded-lg object-cover"
          />

          {/* details */}
          <div className="grid grid-cols-2 gap-5 gap-x-10">
            {!id
              ? Object.keys(user).map(
                  (item, idx) =>
                    !["imgPath", "divisionId"].includes(item) && (
                      <div key={idx} className="flex flex-col">
                        <p className="font-bold">{formatFieldName(item)}</p>
                        <p className="text-sm">{user[item]}</p>
                      </div>
                    ),
                )
              : Object.keys(user).map(
                  (item, idx) =>
                    ![
                      "contactNumber",
                      "username",
                      "imgPath",
                      "divisionId",
                    ].includes(item) && (
                      <div key={idx} className="flex flex-col">
                        <p className="font-bold">{formatFieldName(item)}</p>
                        <p className="text-sm">{user[item]}</p>
                      </div>
                    ),
                )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <PrimaryButton cname="self-center">Change Profile</PrimaryButton>

            <PrimaryButton
              cname="self-center bg-red-600 hover:bg-red-700"
              handleClick={logout}
            >
              Logout
            </PrimaryButton>
          </div>
        </div>

        {/* division */}
        <div className="flex h-fit w-[250px] flex-col gap-3 rounded-lg bg-blue-50 p-10">
          <p>Division</p>

          <select
            className="rounded-lg border-2 border-gray-300 p-3 py-2 outline-none"
            value={divisionId}
            onChange={(e) => setDivisionId(e.target.value)}
            disabled={disableDivisionSelect}
          >
            {divisions.map((item, idx) => (
              <option key={idx} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          {disableDivisionSelect && (
            <PrimaryButton
              cname={"justify-center"}
              handleClick={() => setDisableDivisionSelect(false)}
            >
              Change Division
            </PrimaryButton>
          )}

          {!disableDivisionSelect && (
            <div className="flex w-full items-center gap-1">
              <PrimaryButton
                cname={"justify-center w-full"}
                handleClick={editDivisionId}
              >
                Save
              </PrimaryButton>

              <PrimaryButton
                cname={"justify-center w-full bg-red-700 hover:bg-red-600"}
                handleClick={() => {
                  setDivisionId(user?.divisionId);
                  setDisableDivisionSelect(true);
                }}
              >
                Cancel
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

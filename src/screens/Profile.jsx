import TopBar from "../components/TopBar";
import PrimaryButton from "../components/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/authSlice";
import { uiActions } from "../store/uiSlice";

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
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

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

  return (
    <div className="flex flex-col">
      <TopBar mode="only_profile" />

      <div className="flex items-center justify-center">
        {/* profile */}
        <div className="flex w-fit flex-col gap-10 rounded-lg bg-blue-50 p-10">
          {/* image */}
          <img
            src={user.imgPath}
            className="h-40 w-40 self-center rounded-lg object-cover"
          />

          {/* details */}
          <div className="grid grid-cols-2 gap-5 gap-x-10">
            {Object.keys(user).map(
              (item, idx) =>
                item !== "imgPath" && (
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
      </div>
    </div>
  );
};

export default Profile;

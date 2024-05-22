import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import {
  validateConfirmPassword,
  validateContactNumber,
  validateEmail,
  validateGender,
  validateName,
  validateOldPassword,
  validatePassword,
  validateUsername,
} from "../utils/validations";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/authSlice";
import useEnterKeyPressEffect from "../hooks/useEnterKeyPressEffect";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { uiActions } from "../store/uiSlice";

const EditProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [contactNumber, setContactNumber] = useState(user.contactNumber);
  const [image, setImage] = useState(undefined);
  const [gender, setGender] = useState(user.gender);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [contactNumberError, setContactNumberError] = useState(null);
  const [genderError, setGenderError] = useState(null);
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  const saveRef = useRef(null);
  const imageInputRef = useRef(null);

  const saveProfile = () => {
    if (
      nameError ||
      emailError ||
      usernameError ||
      contactNumberError ||
      genderError
    ) {
      return;
    }

    let flag = 0;

    if (name === "") {
      setNameError("Full name can not be empty!");
      flag = 1;
    }

    if (email === "") {
      setEmailError("Email can not be empty!");
      flag = 1;
    }

    if (username === "") {
      setUsernameError("Username can not be empty!");
      flag = 1;
    }

    if (contactNumber === "") {
      setContactNumberError("Contact number can not be empty!");
      flag = 1;
    }

    if (gender === "") {
      setGenderError("Select your gender!");
      flag = 1;
    }

    if (flag === 1) {
      return;
    }

    // update user
    const existingUsersJSON = localStorage.getItem("users");
    const existingUsers = existingUsersJSON
      ? JSON.parse(localStorage.getItem("users")).map((item) => {
          if (item.id == user.id) {
            return {
              ...item,
              name,
              email,
              username,
              contactNumber,
              gender,
            };
          }

          return item;
        })
      : [];

    const existingUser = existingUsers.find((item) => item.id == user.id);

    // check for fields that changed
    const changedFields = [];
    Object.keys(existingUser).forEach((element) => {
      if (element === "password") {
        return;
      }

      if (existingUser[element] !== user[element]) {
        changedFields.push(element);
      }
    });

    // check if email is taken
    if (changedFields.includes("email")) {
      const existEmail = users.find((item) => item.email === email);

      if (existEmail) {
        setEmailError("This email is used!");
        flag = 1;
      }
    }

    // check if username is taken
    if (changedFields.includes("username")) {
      const existUsername = users.find((item) => item.username === username);

      if (existUsername) {
        setUsernameError("Username is not available!");
        flag = 1;
      }
    }

    if (flag === 1) {
      return;
    }

    // if no changed field
    if (changedFields.length === 0) {
      dispatch(
        uiActions.setNotification({
          type: "error",
          message: "No field is changed!",
          open: true,
        }),
      );

      return;
    }

    const { password, ...userWithoutPassword } = existingUser;

    localStorage.setItem("users", JSON.stringify(existingUsers));
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));

    dispatch(authActions.login(userWithoutPassword));

    dispatch(
      uiActions.setNotification({
        type: "success",
        message: "Profile saved!",
        open: true,
      }),
    );
  };

  const changePassword = () => {
    if (oldPasswordError || newPasswordError || confirmNewPasswordError) {
      return;
    }

    let flag = 0;

    if (oldPassword === "") {
      setOldPasswordError("Please enter your old password!");
      flag = 1;
    }

    if (newPassword === "") {
      setNewPasswordError("Please enter desired new password!");
      flag = 1;
    }

    if (confirmNewPassword === "") {
      setConfirmNewPasswordError("Please confirm your password!");
      flag = 1;
    }

    if (flag === 1) {
      return;
    }

    // check if old password is correct
    if (users.find((item) => item.id == user.id).password !== oldPassword) {
      setOldPasswordError("Old password is incorrect!");
      return;
    }

    const existingUsersJSON = localStorage.getItem("users");
    const existingUsers = existingUsersJSON
      ? JSON.parse(existingUsersJSON).map((item) => {
          if (item.id == user.id) {
            return { ...item, password: newPassword };
          }

          return item;
        })
      : [];

    localStorage.setItem("users", JSON.stringify(existingUsers));

    dispatch(
      uiActions.setNotification({
        type: "success",
        message: "Password changed!",
        open: true,
      }),
    );

    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  useEnterKeyPressEffect(saveRef);

  useEffect(() => {
    setUsers(
      localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : [],
    );
  }, []);

  return (
    <div className="mt-20 flex items-center justify-center pb-20 text-sm">
      {/* box */}
      <div className="flex w-[700px] flex-col justify-center">
        {/* header */}
        <div className="mb-5 flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold">Change Profile</h1>
          <p className="text-base font-semibold">Edit your information 🍍</p>
        </div>

        {/* forms */}
        <div className="grid grid-cols-2 gap-3">
          <div className="mb-3 flex flex-col gap-1">
            <label htmlFor="text" className="">
              Full Name
            </label>
            <input
              className="rounded-md border border-gray-300 p-3 py-2  outline-none"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(validateName(e.target.value));
              }}
              type="text"
              placeholder="eg: Will Jo"
              autoComplete="none"
            />

            {nameError && <p className=" text-red-600">{nameError}</p>}
          </div>

          <div className="mb-3 flex flex-col gap-1">
            <label htmlFor="text" className="">
              Email
            </label>
            <input
              className="rounded-md border border-gray-300 p-3 py-2  outline-none"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(validateEmail(e.target.value));
              }}
              type="email"
              placeholder="your@email.com"
              autoComplete="none"
            />

            {emailError && <p className=" text-red-600">{emailError}</p>}
          </div>

          <div className="mb-3 flex flex-col gap-1">
            <label htmlFor="username" className="">
              Username
            </label>
            <input
              className="rounded-md border border-gray-300 p-3 py-2 outline-none"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError(validateUsername(e.target.value));
              }}
              type="text"
              placeholder="your_username"
            />

            {usernameError && <p className=" text-red-600">{usernameError}</p>}
          </div>

          <div className="mb-3 flex flex-col gap-1">
            <label htmlFor="text" className="">
              Contact Number
            </label>
            <input
              className="rounded-md border border-gray-300 p-3 py-2  outline-none"
              value={contactNumber}
              onChange={(e) => {
                setContactNumber(e.target.value);
                setContactNumberError(validateContactNumber(e.target.value));
              }}
              type="text"
              placeholder="+62xxxxxxxxxxx"
              autoComplete="none"
            />

            {contactNumberError && (
              <p className=" text-red-600">{contactNumberError}</p>
            )}
          </div>

          <div className="mb-3 flex flex-col gap-1">
            <label htmlFor="text" className="">
              Image
            </label>

            <div className="flex items-center gap-3">
              <input
                ref={imageInputRef}
                className="rounded-md border border-gray-300 p-3 py-2 outline-none"
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
              />

              {image && (
                <>
                  <img
                    className="h-10 w-10 object-cover"
                    src={URL.createObjectURL(image)}
                  />

                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setImage(undefined);
                      imageInputRef.current.value = "";
                    }}
                  >
                    {/* TODO: continue register function */}
                    <CloseIcon className="text-red-600" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-3 flex flex-col gap-1">
            <label htmlFor="text" className="">
              Gender
            </label>
            <RadioGroup
              row
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setGenderError(validateGender(e.target.value));
              }}
            >
              <FormControlLabel
                value="male"
                control={<Radio size="small" />}
                label="Male"
              />
              <FormControlLabel
                value="female"
                control={<Radio size="small" />}
                label="Female"
              />
            </RadioGroup>

            {genderError && <p className=" text-red-600">{genderError}</p>}
          </div>
        </div>

        <button
          ref={saveRef}
          className="my-5 rounded-md p-3  text-white"
          onClick={saveProfile}
        >
          Save Profile
        </button>

        {/* change password header */}
        <p className="my-5 text-base font-semibold">Change your password 🔑</p>

        {/* change password forms */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <input
              className="rounded-md border border-gray-300 p-3 py-2  outline-none"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setOldPasswordError(validateOldPassword(e.target.value));
              }}
              type="password"
              placeholder="Old Password"
            />

            {oldPasswordError && (
              <p className=" text-red-600">{oldPasswordError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              className="rounded-md border border-gray-300 p-3 py-2  outline-none"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setNewPasswordError(validatePassword(e.target.value));
                setConfirmNewPasswordError(
                  validateConfirmPassword(e.target.value, confirmNewPassword),
                );
              }}
              type="password"
              placeholder="New Password"
            />

            {newPasswordError && (
              <p className=" text-red-600">{newPasswordError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              className="rounded-md border border-gray-300 p-3 py-2  outline-none"
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
                setConfirmNewPasswordError(
                  validateConfirmPassword(newPassword, e.target.value),
                );
              }}
              type="password"
              placeholder="Confirm New Password"
            />

            {confirmNewPasswordError && (
              <p className=" text-red-600">{confirmNewPasswordError}</p>
            )}
          </div>

          <button
            className="rounded-md bg-green-700 p-3 text-white"
            onClick={changePassword}
          >
            Save Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

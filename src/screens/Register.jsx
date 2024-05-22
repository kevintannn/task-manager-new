import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import MyLogo from "../components/MyLogo";
import {
  validateConfirmPassword,
  validateContactNumber,
  validateEmail,
  validateGender,
  validateName,
  validatePassword,
  validateUsername,
} from "../utils/validations";
import { useDispatch, useSelector } from "react-redux";
import useEnterKeyPressEffect from "../hooks/useEnterKeyPressEffect";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { uiActions } from "../store/uiSlice";

const Register = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [image, setImage] = useState(undefined);
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [contactNumberError, setContactNumberError] = useState(null);
  const [genderError, setGenderError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const registerRef = useRef(null);
  const imageInputRef = useRef(null);

  const navigate = useNavigate();

  const handleRegister = () => {
    if (
      nameError ||
      emailError ||
      usernameError ||
      contactNumberError ||
      genderError ||
      passwordError ||
      confirmPasswordError
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

    if (contactNumber === "") {
      setContactNumberError("Contact number can not be empty!");
      flag = 1;
    }

    if (username === "") {
      setUsernameError("Username can not be empty!");
      flag = 1;
    }

    if (gender === "") {
      setGenderError("Select your gender!");
      flag = 1;
    }

    if (password === "") {
      setPasswordError("Password can not be empty!");
      flag = 1;
    }

    if (confirmPassword === "") {
      setConfirmPasswordError("Confirm password can not be empty!");
      flag = 1;
    }

    if (flag === 1) {
      return;
    }

    // check if user is registered
    const existUser = users.find((item) => item.email === email);
    const existUsername = users.find((item) => item.username === username);

    if (existUser) {
      setEmailError("This email is registered!");
      flag = 1;
    }

    if (existUsername) {
      setUsernameError("Username is not available!");
      flag = 1;
    }

    if (flag === 1) {
      return;
    }

    // register user
    const newUserId = users?.[users.length - 1]?.id
      ? parseInt(users?.[users.length - 1]?.id) + 1
      : 1;

    const newUser = {
      id: newUserId,
      name,
      email,
      gender,
      contactNumber,
      imgPath: null,
      divisionId: 1,
      username,
      password,
    };

    const existingUsers = users;

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    dispatch(
      uiActions.setNotification({
        type: "success",
        message: "Successfully registered. Please login!",
        open: true,
      }),
    );

    return navigate("/login");
  };

  useEnterKeyPressEffect(registerRef);

  useEffect(() => {
    setUsers(
      localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : [],
    );
  }, []);

  return auth.user.id ? (
    <Navigate to="/" />
  ) : (
    <div className="relative flex h-screen w-screen items-center justify-center text-sm">
      {/* box */}
      <div className="flex w-[700px] flex-col justify-center">
        {/* header */}
        <div className="mb-5 flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold">Register</h1>
          <p className="text-base font-semibold">Create an account! 🌽</p>
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

          <div className="mb-3 flex flex-col gap-1">
            <label htmlFor="password" className="">
              Password
            </label>
            <input
              className="rounded-md border border-gray-300 p-3 py-2  outline-none"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
                setConfirmPasswordError(
                  validateConfirmPassword(e.target.value, confirmPassword),
                );
              }}
              type="password"
              placeholder="Enter your password"
            />

            {passwordError && <p className=" text-red-600">{passwordError}</p>}
          </div>

          <div className="mb-3 flex flex-col gap-1">
            <label htmlFor="password" className="">
              Confirm Password
            </label>
            <input
              className="rounded-md border border-gray-300 p-3 py-2  outline-none"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError(
                  validateConfirmPassword(password, e.target.value),
                );
              }}
              type="password"
              placeholder="Confirm your password"
            />

            {confirmPasswordError && (
              <p className=" text-red-600">{confirmPasswordError}</p>
            )}
          </div>
        </div>

        <button
          ref={registerRef}
          className="my-5 rounded-md bg-blue-700 p-3 text-white"
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="text-center">
          Have an account?{" "}
          <Link to="/login" className="font-bold text-blue-700 hover:underline">
            Log in here <ArrowOutwardIcon fontSize="small" />
          </Link>
        </p>
      </div>

      {/* logo */}
      <div className="absolute left-3 top-3">
        <MyLogo />
      </div>
    </div>
  );
};

export default Register;

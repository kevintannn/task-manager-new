import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import MyLogo from "../components/MyLogo";
import { validatePassword, validateUsername } from "../utils/validations";
import { useDispatch } from "react-redux";
import { authActions } from "../store/authSlice";
import useEnterKeyPressEffect from "../hooks/useEnterKeyPressEffect";

const Auth = () => {
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const loginRef = useRef(null);

  const handleLogin = () => {
    if (usernameError || passwordError) {
      return;
    }

    if (username === "") {
      setUsernameError("Username can not be empty!");
    }

    if (password === "") {
      setPasswordError("Password can not be empty!");
    }

    if (username && password) {
      // should do: check credentials in database
      const user = users.find((item) => item.username === username);

      if (user?.password === password) {
        const { password, ...userWithoutPassword } = user; // password is only to filter it out

        dispatch(authActions.login(userWithoutPassword));
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      } else {
        alert("Account not registered / wrong credentials!");
        setUsername("");
        setPassword("");
      }
    }
  };

  useEnterKeyPressEffect(loginRef);

  useEffect(() => {
    setUsers(
      localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : [],
    );
  }, []);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center text-sm">
      <div className="flex w-[350px] flex-col justify-center">
        <div className="mb-5 flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold">Login</h1>
          <p className="text-base font-semibold">Hi, welcome back! 🎷</p>
        </div>

        <div className="mb-3 flex flex-col gap-1">
          <label htmlFor="text" className="">
            Username
          </label>
          <input
            className="rounded-md border border-gray-300 p-3 py-2  outline-none"
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
          <label htmlFor="password" className="">
            Password
          </label>
          <input
            className="rounded-md border border-gray-300 p-3 py-2  outline-none"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(validatePassword(e.target.value));
            }}
            type="password"
            placeholder="Enter your password"
          />

          {passwordError && <p className=" text-red-600">{passwordError}</p>}
        </div>

        <Link className="text-right  font-bold text-blue-700 hover:underline">
          Forgot Password?
        </Link>

        <button
          ref={loginRef}
          className="my-5 rounded-md bg-blue-700 p-3  text-white"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-center ">
          Not registered yet?{" "}
          <Link className="font-bold text-blue-700 hover:underline">
            Create an account <ArrowOutwardIcon fontSize="small" />
          </Link>
        </p>
      </div>

      <div className="absolute left-3 top-3">
        <MyLogo />
      </div>
    </div>
  );
};

export default Auth;

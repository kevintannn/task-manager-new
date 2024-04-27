import { authActions } from "./authSlice";

export const getUser = () => {
  return (dispatch) => {
    const user = localStorage.getItem("user");

    if (user) {
      dispatch(authActions.login(JSON.parse(user)));
    }
  };
};

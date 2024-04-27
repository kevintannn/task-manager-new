export const validateUsername = (username) => {
  if (username.includes(" ")) {
    return "Invalid username";
  }

  if (username.length > 0 && username.length < 5) {
    return "Min. 5 characters";
  }

  return null;
};

export const validatePassword = (password) => {
  if (password.length > 0 && password.length <= 8) {
    return "Min. 8 characters";
  }

  return null;
};

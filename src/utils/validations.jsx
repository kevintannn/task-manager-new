export const validateName = (name) => {
  if (name.length > 0 && name.length < 3) {
    return "Min. 3 characters";
  }

  return null;
};

export const validateEmail = (email) => {
  if (email.includes(" ")) {
    return "Invalid email";
  }

  if (email.length > 0 && email.length < 3) {
    return "Min. 3 characters";
  }

  return null;
};

export const validateUsername = (username) => {
  if (username.includes(" ")) {
    return "Invalid username";
  }

  if (username.length > 0 && username.length < 5) {
    return "Min. 5 characters";
  }

  return null;
};

export const validateContactNumber = (contactNumber) => {
  if (contactNumber.includes(" ")) {
    return "Invalid contact number";
  }

  if (contactNumber.match(/[^0-9+]/)) {
    return "Invalid contact number";
  }

  if (contactNumber.length > 0 && contactNumber.length < 10) {
    return "Invalid contact number";
  }

  return null;
};

export const validateGender = (gender) => {
  return null;
};

export const validateOldPassword = (password) => {
  return null;
};

export const validatePassword = (password) => {
  if (password.length > 0 && password.length < 8) {
    return "Min. 8 characters";
  }

  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password !== confirmPassword
  ) {
    return "Wrong confirmation password";
  }

  if (password.length === 0 && confirmPassword.length > 0) {
    return "Enter password before confirming";
  }

  return null;
};

export const validateTaskTitle = (title) => {
  return null;
};

export const validateTaskPriority = (priority) => {
  return null;
};

export const validateTaskDivision = (division) => {
  return null;
};

export const validateTaskPeople = (people) => {
  return null;
};

export const validateDate = (startDate, endDate) => {
  if (startDate === "" || endDate === "") {
    return null;
  }

  if (startDate > endDate) {
    return "Start date can not be higher than end date";
  }

  if (startDate === endDate) {
    return "Start date can not be the same as end date";
  }

  return null;
};

export const validateProjectName = (projectName) => {
  return null;
};

export const validateDeadline = (deadline) => {
  return null;
};

export const validateProjectType = (projectType) => {
  return null;
};

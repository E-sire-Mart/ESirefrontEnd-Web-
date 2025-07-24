const isAdmin = (s) => {
  if (s === "VENDOR") {
    return true;
  }

  return false;
};

export default isAdmin;

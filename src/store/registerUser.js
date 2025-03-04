import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  _id: "",
  email: "",
};

const RegisterUser = createSlice({
  name: "user",
  initialState: initialValue,
  reducers: {
    setRegisterUserDetails: (state, action) => {
      state._id = action.payload?._id;
      state.email = action.payload?.email;
    },
  },
});

export const { setRegisterUserDetails } = RegisterUser.actions;

export default RegisterUser.reducer;

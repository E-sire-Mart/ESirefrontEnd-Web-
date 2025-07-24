import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  isLogin: boolean
};

const initialState: InitialState = {
  isLogin: false
};

const status = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoginStatus: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    }
  },
});

export default status.reducer;
export const { setLoginStatus } =
  status.actions;

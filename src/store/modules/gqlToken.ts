import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = "";

export const gqlTokenSlice = createSlice({
  name: "gqlToken",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => action.payload,
  },
});

// Action creators are generated for each case reducer function
export const { setToken } = gqlTokenSlice.actions;

export default gqlTokenSlice.reducer;

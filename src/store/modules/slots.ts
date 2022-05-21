import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import SlotMachine from "../../apis/SlotMachine";
import { DBSlotDisplay } from "./types";

const initialState: DBSlotDisplay[] = SlotMachine.pullHandle();

export const slotsSlice = createSlice({
  name: "slots",
  initialState,
  reducers: {
    /** play the slots game, updating the slots reel in Slots DB and player/dealer money in Player DB */
    updateDBSlotMachine: (state, action: PayloadAction<DBSlotDisplay[]>) => [
      ...action.payload,
    ],
  },
});

// Action creators are generated for each case reducer function
export const { updateDBSlotMachine } = slotsSlice.actions;

export default slotsSlice.reducer;

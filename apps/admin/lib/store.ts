import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

type AdminState = {
  dashboardTitle: string;
};

const initialState: AdminState = {
  dashboardTitle: "pin-stitch admin"
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setDashboardTitle: (state, action: PayloadAction<string>) => {
      state.dashboardTitle = action.payload;
    }
  }
});

export const { setDashboardTitle } = adminSlice.actions;

export const store = configureStore({
  reducer: {
    admin: adminSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  siteName: string;
};

const initialState: AppState = {
  siteName: "pin-stitch"
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSiteName: (state, action: PayloadAction<string>) => {
      state.siteName = action.payload;
    }
  }
});

export const { setSiteName } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

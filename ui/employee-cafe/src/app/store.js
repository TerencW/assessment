import { configureStore } from "@reduxjs/toolkit";
import cafeReducer from "../services/cafeSlice";

const store = configureStore({
  reducer: {
    cafes: cafeReducer,
  },
});

export default store;

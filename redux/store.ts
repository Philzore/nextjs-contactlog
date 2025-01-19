import { configureStore } from "@reduxjs/toolkit";
import contactReducer from "./contactSlice";


const store = configureStore({
    reducer: {
        contact: contactReducer,
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export default store;
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
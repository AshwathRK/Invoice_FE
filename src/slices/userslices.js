import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null
};

const userSlices = createSlice({
    name: 'userDetails',
    initialState,
    reducers: {
        addUserDetails(state, action) {
            state.user = action.payload;
        },
        clearUserDetails(state) {
            state.user = null;
        }
    }
});

export const { addUserDetails, clearUserDetails } = userSlices.actions;
export default userSlices.reducer;
    
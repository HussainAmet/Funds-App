import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    memberDetails: {},
    allMembersDetails: [],
}

const postSlice = createSlice ({
    name: "member",
    initialState,
    reducers: {
        getMemberDetails: (state, action) => {
            state.memberDetails = action.payload.member;
        },
        getAllMembersDetails: (state, action) => {
            state.allMembersDetails = action.payload.allMembers
        },
        addMember: (state, action) => {
            state.allMembersDetails.push(action.payload.newMember)
        },
    }
})

export const { getMemberDetails, getAllMembersDetails, addMember } = postSlice.actions;

export default postSlice.reducer;
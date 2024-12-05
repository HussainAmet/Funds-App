import { createSlice } from "@reduxjs/toolkit";
// import dotenv from 'dotenv'
// dotenv.config();

const initialState = {
    status: false,
    memberDetails: {},
    allMembersDetails: [],
    totalLoanRemaining: 0,
}

const postSlice = createSlice ({
    name: "member",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true
        },
        getMemberDetails: (state, action) => {
            state.memberDetails = action.payload.member;
        },
        getAllMembersDetails: (state, action) => {
            if (import.meta.env.VITE_TEST) {
                state.allMembersDetails = action.payload.allMembers;
            } else {
                state.allMembersDetails = action.payload.allMembers.filter((member) => member.data.auth.data.role.includes("member"));
            }
            state.allMembersDetails = state.allMembersDetails.sort((name1, name2) => {
                if (name1.data.auth.data.name.toLowerCase() < name2.data.auth.data.name.toLowerCase()) {
                    return -1;
                }
                if (name1.data.auth.data.name.toLowerCase() > name2.data.auth.data.name.toLowerCase()) {
                    return 1;
                }
                return 0;
            });
            state.totalLoanRemaining = state.allMembersDetails.reduce((total, member) => {
                if (member.data.loanRemaining) {
                    return total + member.data.loanRemaining;
                }
                return total;
            }, 0);
        },
        addMember: (state, action) => {
            state.allMembersDetails.push(action.payload.newMember);
            state.allMembersDetails = state.allMembersDetails.sort((name1, name2) => {
                if (name1.data.auth.data.name.toLowerCase() < name2.data.auth.data.name.toLowerCase()) {
                    return -1;
                }
                if (name1.data.auth.data.name.toLowerCase() > name2.data.auth.data.name.toLowerCase()) {
                    return 1;
                }
                return 0;
            });
        },
        delMember: (state, action) => {
            state.allMembersDetails = state.allMembersDetails.filter((member) => member._id !== action.payload.id)
            state.memberDetails.totalSavings.totalSavings = state.memberDetails.totalSavings.totalSavings - action.payload.saving
        },
        blockUnblock: (state, action) => {
            // mongo
            const foundMember = state.allMembersDetails.find((member) => member.data.auth._id === action.payload.id)

            // firebase
            // const foundMember = state.allMembersDetails.find((member) => member._id === action.payload.id)

            if (foundMember) {
                foundMember.data.auth.data.blocked = !foundMember.data.auth.data.blocked;
            }
        },
        logout: (state, action) => {
            state.status = false;
            state.memberDetails = {};
            state.allMembersDetails = [];
        }
    }
})

export const { login, getMemberDetails, getAllMembersDetails, addMember, delMember, blockUnblock, logout } = postSlice.actions;

export default postSlice.reducer;

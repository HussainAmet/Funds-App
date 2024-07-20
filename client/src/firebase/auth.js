import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { app } from './firebase'

const fundsApp = getFirestore(app);

// export const addMember = async () => {
//     const newMemberAuth = await addDoc(collection(fundsApp, "authdetails"), {
//         data: {
//             active: true,
//             name: "Hussain Amet",
//             phone: "8739975253",
//             role: ["admin", "host"],
//         }
//     });
//     console.log(newMemberAuth)
//     const newMemberDetails = await addDoc(collection(fundsApp, "authdetails"), {
//         "data": {
//             saving: 0,
//             active: true,
//             auth: ,
//         }
//     });
// }

export const getMembers = async () => {
    const members = query(collection(fundsApp, "members"), where("active", "==", true));
    const querySnapshot = await getDocs(members);
    querySnapshot.forEach((member) => {
    console.log(member.id, " => ", member.data());
    });
}
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    query,
    where,
    getDocs,
    getDoc,
    updateDoc,
    deleteField,
    increment,
    arrayUnion,
    writeBatch,
} from "firebase/firestore";
import { app } from "./firebase";
import generateUniqueId from 'generate-unique-id';

const fundsApp = getFirestore(app);

const getMembers = async () => {
    if (!navigator.onLine) {
        throw new Error("No internet connection");
    }

    try {
        const membersQuery = query(
            collection(fundsApp, "members"),
            where("data.auth.data.active", "==", true)
        );
        const querySnapshot = await getDocs(membersQuery);

        const memberDetailPromises = querySnapshot.docs.map(async (member) => {
            let memberDetail = { ...member.data(), _id: member.id };

            const totalSavingsRef = memberDetail.data.totalSavings;

            if (totalSavingsRef) {
                const totalSavingsDoc = await getDoc(totalSavingsRef);
                if (totalSavingsDoc.exists()) {
                    memberDetail.data.totalSavings = totalSavingsDoc.data();
                    return memberDetail;
                } else {
                    throw new Error("No such document found in totalSavings reference!");
                }
            }
        });

        const allMembers = await Promise.all(memberDetailPromises);
        return allMembers;
    } catch (error) {
        console.error("Error in getMembers:", error);
        throw error;
    }
};

const getMemberDetails = async (phone) => {
    if (!navigator.onLine) {
        throw new Error("No internet connection");
    }

    try {
        const memberDetails = query(
            collection(fundsApp, "members"),
            where("data.auth.data.phone", "==", String(phone)),
            where("data.auth.data.active", "==", true)
        );

        const memberDetailsSnapshot = await getDocs(memberDetails);

        if (memberDetailsSnapshot.empty) {
            throw new Error("Member Not Found");
        }

        const memberDetailPromises = [];

        memberDetailsSnapshot.forEach((memberDoc) => {
            let memberDetail = { ...memberDoc.data(), _id: memberDoc.id };
            const totalSavingsRef = memberDetail.data.totalSavings;

            if (totalSavingsRef) {
                const totalSavingsDocPromise = getDoc(totalSavingsRef).then((totalSavingsDoc) => {
                    if (totalSavingsDoc.exists()) {
                        memberDetail.data.totalSavings = totalSavingsDoc.data();
                        return memberDetail;
                    } else {
                        throw new Error("No such document found in totalSavings reference!");
                    }
                });

                memberDetailPromises.push(totalSavingsDocPromise);
            } else {
                memberDetailPromises.push(Promise.resolve(memberDetail));
            }
        });

        const getMemberDetails = await Promise.all(memberDetailPromises);

        return getMemberDetails[0];
    } catch (error) {
        console.error("Error in getMemberDetails:", error);
        throw error;
    }
};

export const fireLogin = async (phone) => {
    if (!navigator.onLine) {
        throw new Error("No internet connection");
    }

    try {
        const member = await getMemberDetails(phone);
        if (member?.data?.auth?.data?.blocked) {
            throw new Error("Your number is blocked");
        }
        if (member?.data?.auth?.data?.role.includes("host")) {
            const members = await getMembers()
            return { data: { member, members } }
        }
        return { data: { member } }
    } catch (error) {
        console.error("Error in fireLogin:", error);
        throw error;
    }
};

export const fireAddMember = async ({ name, phone }) => {
    if (!navigator.onLine) {
        throw new Error("No internet connection");
    }

    try {
        const q = query(collection(fundsApp, "members"), where("data.auth.data.phone", "==", phone));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            throw new Error("Phone number already exists");
        }

        const totalSavingsDocRef = doc(fundsApp, "totalsavings/totalSavings");
        await addDoc(collection(fundsApp, "members"), {
            data: {
                saving: 0,
                auth: {
                    data: {
                        active: true,
                        blocked: false,
                        name: String(name),
                        phone: String(phone),
                        role: ["member"],
                    },
                },
                savingDetails: [],
                loanDetails: [],
                totalSavings: totalSavingsDocRef,
            }
        });
        const newMember = await getMemberDetails(phone);
        return { data: newMember };
    } catch (error) {
        console.error("Error in fireAddMember:", error);
        throw error;
    }
}

export const fireAddSavings = async ({ id, amount, year, month }) => {
    if (!navigator.onLine) {
        throw new Error("No internet connection");
    }

    try {
        const memberRef = doc(fundsApp, 'members', String(id));
        await updateDoc(memberRef, {
            "data.saving": increment(amount),
            "data.savingDetails": arrayUnion(
                {
                    _id: generateUniqueId({ length: 24, useLetters: true, }),
                    amount: amount,
                    month: month,
                    year: String(year),
                },
            ),
        });
        const totalSavingsDocRef = doc(fundsApp, "totalsavings/totalSavings");
        await updateDoc(totalSavingsDocRef, {
            totalSavings: increment(amount),
        });

        return { data: "ok", status: 200 };
    } catch (error) {
        console.error("Error in fireAddSavings:", error);
        throw error;
    }
}

export const fireAddLoanInstallment = async ({ id, amount, year, month }) => {
    if (!navigator.onLine) {
        throw new Error("No internet connection");
    }

    try {
        const memberRef = doc(fundsApp, 'members', String(id));
        await updateDoc(memberRef, {
            "data.loanRemaining": increment(-amount),
            "data.loanDetails": arrayUnion(
                {
                    _id: generateUniqueId({ length: 24, useLetters: true, }),
                    amount: amount,
                    month: month,
                    year: String(year),
                },
            ),
        });
        const totalSavingsDocRef = doc(fundsApp, "totalsavings/totalSavings");
        await updateDoc(totalSavingsDocRef, {
            totalSavings: increment(amount),
        });
        const memberUpdatedDocRef = doc(fundsApp, 'members', String(id));
        const docSnap = await getDoc(memberUpdatedDocRef);
        if (docSnap.exists()) {
            const memberUpdated = docSnap.data();
            if (memberUpdated.data.loanRemaining === 0) {
                await updateDoc(memberUpdatedDocRef, {
                    "data.loanRemaining": deleteField(),
                    "data.loanDate": deleteField(),
                });
            }
        }

        return { data: "ok", status: 200 };
    } catch (error) {
        console.error("Error in fireAddLoanInstallment:", error);
        throw error;
    }
}

export const fireGiveLoan = async ({ id, amount, loanDate }) => {
    if (!navigator.onLine) {
        throw new Error("No internet connection");
    }

    try {
        const memberRef = doc(fundsApp, 'members', String(id));
        await updateDoc(memberRef, {
            "data.loanRemaining": increment(amount),
            "data.loanDate": String(loanDate),
        });
        const totalSavingsDocRef = doc(fundsApp, "totalsavings/totalSavings");
        await updateDoc(totalSavingsDocRef, {
            totalSavings: increment(-amount),
        });

        return { data: "ok", status: 200 };
    } catch (error) {
        console.error("Error in fireGiveLoan:", error);
        throw error;
    }
}

export const fireDeleteMember = async ({ id, phone, saving }) => {
    if (!navigator.onLine) {
        throw new Error("No internet connection");
    }

    try {
        const delDate = new Date();
        const memberRef = doc(fundsApp, 'members', String(id));
        await updateDoc(memberRef, {
            "data.auth.data.deletedOn": delDate,
            "data.auth.data.active": false,
            "data.auth.data.phone": `${phone} del ${delDate}`
        });
        const totalSavingsDocRef = doc(fundsApp, "totalsavings/totalSavings");
        await updateDoc(totalSavingsDocRef, {
            totalSavings: increment(-saving),
        });

        return { data: "ok", status: 200 };
    } catch (error) {
        console.error("Error in fireDeleteMember:", error);
        throw error;
    }
}

export const fireBlockUnblockMember = async ({ id }) => {
    if (!navigator.onLine) {
        throw new Error("No internet connection");
    }

    try {
        const memberRef = doc(fundsApp, 'members', String(id));
        const querySnapshot = await getDoc(memberRef);
        await updateDoc(memberRef, {
            "data.auth.data.blocked": !querySnapshot.data().data?.auth?.data?.blocked,
        });

        return { data: "ok", status: 200 };
    } catch (error) {
        console.error("Error in fireBlockUnblockMember:", error);
        throw error;
    }
}

// export const fireAddNewFieldInAllMembers = async () => {
//     if (!navigator.onLine) {
//         throw new Error("No internet connection");
//     }

//     try {

//         const membersCollectionRef = collection(fundsApp, "members");
//         const batch = writeBatch(fundsApp);
//         const querySnapshot = await getDocs(membersCollectionRef);
//         querySnapshot.forEach(doc => {
//             batch.update(doc.ref, { ["data.auth.data.blocked"]: false });
//         });

//         await batch.commit();

//     } catch (error) {
//         console.error("Error in fireAddMemberManual:", error);
//         throw error;
//     }
// }
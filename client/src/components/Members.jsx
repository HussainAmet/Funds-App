import React, { useEffect, useState } from "react";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AddMember from "./AddMember";
import { useDispatch } from "react-redux";
import { delMember, blockUnblock } from "../store/memberDetailsSlice";
import { fireDeleteMember, fireBlockUnblockMember } from "../firebase/auth";

export default function Members() {
  const [input, setInput] = useState("");
  const [selectedMember, setSelectedMember] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [memberDetails, setMemberDetails] = useState();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openActionModal, setOpenActionModal] = useState(false);
  const [actionMemberId, setActionMemberId] = useState("");
  const [actionMemberPhone, setActionMemberPhone] = useState("");
  const [actionMemberName, setActionMemberName] = useState("");
  const [actionMemberSaving, setActionMemberSaving] = useState();
  const [actionMemberBlocked, setActionMemberBlocked] = useState();
  const [action, setAction] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const members = useSelector((state) => state.member.allMembersDetails);
  const currentMember = useSelector((state) => state.member.memberDetails);
  const totalLoanRemaining = useSelector(
    (state) => state.member.totalLoanRemaining
  );

  const handleChange = (e) => {
    const { value } = e.target;
    setInput(value);
    const filteredMembers = memberData.filter((member) =>
      member.data.auth.data.name.toLowerCase().includes(value.toLowerCase())
    );
    if (filteredMembers.length === 0) {
      setSelectedMember(memberData);
    } else {
      setSelectedMember(filteredMembers);
    }
  };

  const deleteMember = async ({ id, phone, saving }) => {
    try {
      const member = members.find((member) => member._id === id);
      if (member.data.loanRemaining > 0) {
        throw new Error("Member has loan pending");
      }
      const response = await fireDeleteMember({ id, phone, saving });
      if (response.data === "ok" && response.status === 200) {
        dispatch(delMember({ id, saving }));
        setSuccess("Member Deleted");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Error in deleteMember:", error);
      if (error?.message) {
        setError(error.message);
      } else {
        setError("An error occurred.");
      }
    }
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  };

  const blockUnblockMember = async ({ id }) => {
    try {
      const response = await fireBlockUnblockMember({ id });
      if (response.data === "ok" && response.status === 200) {
        dispatch(blockUnblock({ id }));
        setSuccess(`Member ${actionMemberBlocked ? "Unblocked" : "Blocked"}`);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Error in blockUnblockMember:", error);
      if (error?.message) {
        setError(error.message);
      } else {
        setError("An error occurred.");
      }
    }
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  };

  const handleAddMemberClick = () => {
    setShowAddMember(true);
    setIsAddMemberOpen(true);
  };

  const handleAddMemberClose = (success) => {
    setShowAddMember(false);
    setIsAddMemberOpen(false);
    if (success === "success") {
      setSuccess("Member Added");
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    }
  };

  useEffect(() => {
    setInput("");
    setMemberData(members);
    setSelectedMember(members);
    setMemberDetails(currentMember);
  }, [members, currentMember]);

  return (
    <>
      {isAddMemberOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-1"></div>
      )}
      <div className="profile-info">
        <p className="fs-2 text-center m-0">
          Total Balance: {memberDetails?.totalSavings?.totalSavings}
        </p>
        <p className="fs-2 text-center">Total Loan: {totalLoanRemaining}</p>
      </div>
      <div className="d-flex w-100 mb-3 d-flex justify-content-around ">
        <input
          type="text"
          placeholder="Search Member"
          className="ms-3 w-50  border-top-0 border-end-0 border-start-0"
          style={{ borderColor: "var(--primary-300)" }}
          maxLength={50}
          value={input}
          onChange={handleChange}
        />
        <Link to="/host/members/add-member">
          <Button
            variant="solid"
            sx={{
              backgroundColor: "var(--primary-300)",
              "&:hover": { backgroundColor: "var(--primary-200)" },
              "&:disabled": { backgroundColor: "var(--secondary)" },
            }}
            onClick={handleAddMemberClick}
          >
            Add Member
          </Button>
        </Link>
      </div>
      <Outlet />
      {error && (
        <span className="fw-semibold text-white mt-2 mb-2 p-2 d-block text-center bg-danger">
          {error}
        </span>
      )}
      {success && (
        <span className="fw-semibold text-bg-success mt-2 mb-2 p-2 d-block text-center">
          {success}
        </span>
      )}
      <Sheet sx={{ overflowY: "auto" }}>
        <Table
          aria-label="table with sticky header"
          stickyHeader
          stickyFooter
          hoverRow
        >
          <thead>
            <tr>
              <th className="ps-4 text-start w-50">Name</th>
              <th className="text-center">Saving</th>
              {memberDetails?.auth?.data?.role?.includes("admin") ? (
                <th className="text-center">Action</th>
              ) : (
                ""
              )}
            </tr>
          </thead>
          <tbody>
            {selectedMember.map((member) => (
              <tr key={member._id}>
                <td
                  onClick={() => {
                    navigate(`/member-profile/${member._id}/dashboard/profile`);
                  }}
                  className="ps-4 text-start cursor-pointer"
                >
                  {member.data.auth.data.name}
                </td>
                <td className="text-center">{member.data.saving}</td>
                {memberDetails?.auth?.data?.role?.includes("admin") ? (
                  <td className="text-center">
                    {member?.data?.auth?.data?.role?.includes("admin") ||
                      member?.data?.auth?.data?.role?.includes("host") ||
                      member?.data?.auth?.data?.name === "Member" ? (
                      "-"
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 48 48"
                        className="bi bi-person-dash cursor-pointer"
                        onClick={() => {
                          setActionMemberId(member._id);
                          setActionMemberName(member.data.auth.data.name);
                          setActionMemberPhone(member.data.auth.data.phone)
                          setActionMemberBlocked(member.data.auth.data.blocked)
                          setActionMemberSaving(member.data.saving)
                          setOpenActionModal(true);
                        }}
                      >
                        <g
                          fill="none"
                          stroke="black"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        >
                          <rect width="30" height="36" x="9" y="8" rx="2" />
                          <path
                            strokeLinecap="round"
                            d="M18 4v6m12-6v6m-14 9h16m-16 8h12m-12 8h8"
                          />
                        </g>
                      </svg>
                    )}
                  </td>
                ) : (
                  ""
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {memberDetails?.auth?.data?.role?.includes("admin") ? (
                <td colSpan={3} align="center">
                  Total Members :- {memberData?.length}
                </td>
              ) : (
                <td colSpan={2} align="center">
                  Total Members :- {memberData?.length}
                </td>
              )}
            </tr>
          </tfoot>
        </Table>
      </Sheet>
      {showAddMember && <AddMember onClose={handleAddMemberClose} />}

      <Modal open={openActionModal} onClose={() => setOpenActionModal(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Take Action
          </DialogTitle>
          <Divider />
          <DialogContent>
            <p>
              <span className="text-primary fw-bold">{actionMemberName}</span>
            </p>
          </DialogContent>
          <div className="d-flex flex-column gap-3">
            <Button
              variant="solid"
              color="danger"
              onClick={() => {
                setAction(actionMemberBlocked ? "Unblock" : "Block");
                setOpenConfirmationModal(true);
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="white"
                    d="M10 4a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4a4 4 0 0 0-4-4m0 2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 7c-2.67 0-8 1.33-8 4v3h9.5a6.5 6.5 0 0 1-.47-1.9H3.9V17c0-.64 3.13-2.1 6.1-2.1c.5 0 1 .05 1.5.13a6.5 6.5 0 0 1 1.05-1.74C11.61 13.1 10.71 13 10 13m7.5 0C15 13 13 15 13 17.5s2 4.5 4.5 4.5s4.5-2 4.5-4.5s-2-4.5-4.5-4.5m0 1.5c1.66 0 3 1.34 3 3c0 .56-.15 1.08-.42 1.5L16 14.92c.42-.27.94-.42 1.5-.42M14.92 16L19 20.08c-.42.27-.94.42-1.5.42c-1.66 0-3-1.34-3-3c0-.56.15-1.08.42-1.5"
                  />
                </svg>
                <p className="m-0">{actionMemberBlocked ? "Unblock" : "Block"} Member</p>
              </div>
            </Button>
            <Button
              variant="outlined"
              color="danger"
              onClick={() => {
                setAction("Delete");
                setOpenConfirmationModal(true);
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                  <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                </svg>
                <p className="m-0">Delete Member</p>
              </div>
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => { setOpenActionModal(false) }}
            >
              Cancel
            </Button>
          </div>
        </ModalDialog>
      </Modal>
      <Modal open={openConfirmationModal} onClose={() => setOpenConfirmationModal(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            <p>
              Are you sure you want to <span className="fw-bold">{action}</span>{" "}
              the member{" "}
              <span className="text-primary fw-bold">{actionMemberName}</span> ?
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              onClick={() => {
                action === "Delete"
                  ? deleteMember({
                    id: actionMemberId,
                    phone: actionMemberPhone,
                    saving: actionMemberSaving,
                  })
                  : blockUnblockMember({ id: actionMemberId });
                setOpenConfirmationModal(false);
                setOpenActionModal(false);
              }}
            >
              {action} Member
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenConfirmationModal(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Textarea from "@mui/joy/Textarea";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import moment from "moment-timezone";
import {
  getMemberDetails,
  getAllMembersDetails,
  logout,
} from "../store/memberDetailsSlice";
import { TextField } from "@mui/material";
import { fireAddLoanInstallment, fireAddSavings, fireGiveLoan, fireLogin } from "../firebase/auth";
import axios from "axios";
import config from "../config/config";

const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function UpdateDetails() {
  const [memberId, setMemberId] = useState("");
  const [memberData, setMemberData] = useState([]);
  const [date, setDate] = useState();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [amount, setAmount] = useState("");
  const [page, setPage] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();
  const { what } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentMember = useSelector((state) => state.member.memberDetails);
  const userData = useSelector((state) => state.member.allMembersDetails);

  const updateDetails = async (data) => {
    setLoading(true);
    setError("");
    const selectedMember = memberData.find(
      (member) => member._id === data.member
    ).data;
    try {
      if (what === "add-savings") {
        let savings = selectedMember.savingDetails.filter(
          (saving) => saving.year == year
        );
        if (savings.find((saving) => saving.month === (Months.indexOf(month) + 1))) {
          throw new Error("Savings already added for this month");
        }
      } else if (what === "give-loan") {
        if (selectedMember.loanRemaining && selectedMember.loanDate) {
          throw new Error(`Loan is already given to ${selectedMember.auth.data.name}`);
        }
        if (selectedMember.totalSavings.totalSavings < amount) {
          throw new Error("Total savings are not that much");
        }
      } else if (what === "add-loan-installment") {
        if (!selectedMember.loanRemaining) {
          throw new Error("Member has no loan pending");
        }
        if (selectedMember.loanRemaining < data.amount) {
          throw new Error("Entered amount is geater than loan remaining");
        }
        let loans = selectedMember.loanDetails.filter(
          (loan) => loan.year == year
        );
        if (loans.find((loan) => loan.month === (Months.indexOf(month) + 1))) {
          throw new Error("Loan installment already added for this month");
        }
      }

      // mongodb
      if (what === "add-savings" || what === "add-loan-installment") {
        const response = await axios.post(
          `${config.poductionUrl}${config.requestBaseUrl}${
            what === "add-savings" ? "add-savings" : "add-loan-installment"
          }`,
          { id: data.member, amount: data.amount, year, month: (Months.indexOf(month) + 1), date }
        );

      // firebase
      // if (what === "add-savings") {
      //   const response = await fireAddSavings({ id: data.member, amount: data.amount, year, month: (Months.indexOf(month) + 1) })

        if (response.data === "ok" && response.status === 200) {
          // firebase
          // setSuccess("Savings Added");

          // mongodb
          if (what === "add-savings") {
            setSuccess("Savings Added");
          } else {
            setSuccess("Loan Installment Added");
          }
        }

      // firebase
      // else if (what === "add-loan-installment") {
      //   const response = await fireAddLoanInstallment({ id: data.member, amount: data.amount, year, month: (Months.indexOf(month) + 1) })
      //   if (response.data === "ok" && response.status === 200) {
      //     setSuccess("Loan Installment Added");
      //   }

      } else if (what === "give-loan") {
        const loanDate = month + " " + year;

        // mongodb
        const response = await axios.post(
          `${config.poductionUrl}${config.requestBaseUrl}give-loan`,
          { id: data.member, amount: data.amount, loanDate, date }
        );

        // firebase
        // const response = await fireGiveLoan({ id: data.member, amount: data.amount, loanDate })

        if (response.data === "ok" && response.status === 200) {
          setSuccess(`Loan given to ${selectedMember.auth.data.name}`);
        }
      }

      // mongodb
      const updatedData = await axios.post(
        `${config.poductionUrl}${config.requestBaseUrl}login`,
        { phone: currentMember?.auth?.data?.phone }
      );

      // firebase
      // const updatedData = await fireLogin(currentMember?.auth?.data?.phone);

      if (updatedData.data) {
        dispatch(getMemberDetails({ member: updatedData.data.member.data }));
        dispatch(getAllMembersDetails({ allMembers: updatedData.data.members }));
      } else {
        dispatch(logout());
        navigate("/login");
      }
      setTimeout(() => {
        setSuccess("");
      }, 5000);
      setMemberId("");
      setAmount("");
    } catch (error) {
      console.error("Error in updateDetails:", error);
      if (error?.message) {
        setError(error.message)
      } else {
        setError("An error occurred.");
      }
      setTimeout(() => {
        setError("");
      }, 5000);
    }
    setLoading(false);
  };

  useEffect(() => {
    setError("");
    setAmount("");
    setMemberId("");
    if (what === "add-savings") {
      setPage("Add Savings");
    } else if (what === "give-loan") {
      setPage("Give Loan");
    } else {
      setPage("Add Loan Installment");
    }
    const timezone = "Asia/Kolkata";
    const date = moment.tz(timezone);
    setDate(date.format());
    setYear(date.year());
    setMonth(date.format("MMMM"));
    setMemberData(userData);
  }, [userData, what]);

  return (
    <>
      <h2 className="m-4 text-body-tertiary">{page}</h2>
      <Box
        component="form"
        onSubmit={handleSubmit(updateDetails)}
        sx={{ minWidth: 130, margin: 2 }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Select Member</InputLabel>
          <Select
            {...register("member", {
              required: true,
            })}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={memberId}
            label="Select Member"
            onChange={(event) => setMemberId(event.target.value)}
            required
          >
            {memberData.map((member) => (
              <MenuItem key={member._id} value={member._id}>
                {member.data.auth.data.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        <FormControl
          sx={{
            width: "fit-content",
            marginTop: 3,
            display: "flex",
            flexFlow: "column",
            gap: 3,
          }}
        >
          <div className="d-flex gap-4">
            <div>
              <FormLabel>Year</FormLabel>
              <Textarea value={year} disabled sx={{ width: "150px" }} />
            </div>
            <div>
              <FormLabel>Month</FormLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                sx={{ width: "150px", height: "36px" }}
                required
              >
                {Months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div>
            {what === "add-savings" ? (
              <FormLabel>Saving Amount</FormLabel>
            ) : (
              <FormLabel>Loan Amount</FormLabel>
            )}
            <TextField
              {...register("amount", {
                required: true,
              })}
              inputProps={{ style: { padding: '6px 12px' } }}
              InputProps={{ style: {backgroundColor: '#cfe0e825', borderRadius: '6px', boxShadow: '0px 2px 2px 0px #cfe0e870' } }}
              type='number'
              fullWidth
              name="amount"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              value={amount}
              placeholder="0"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              required
            />
          </div>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            display: "block",
            backgroundColor: "var(--primary-300)",
            "&:hover": { backgroundColor: "var(--primary-200)" },
            "&:disabled": { backgroundColor: "var(--secondary)" },
          }}
          className="px-5 py-2"
          disabled={loading}
        >
          Submit
        </Button>
      </Box>
    </>
  );
}

export default UpdateDetails;

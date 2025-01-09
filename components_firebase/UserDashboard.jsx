import { Outlet, NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UserDashboard() {
  const [role, setRole] = useState("member");

  const { id } = useParams();

  const currentMember = useSelector((state) => state.member.memberDetails);

  useEffect(() => {
    if (currentMember.auth.data.role.includes("host")) {
      setRole("host");
    }
  }, [currentMember]);

  return (
    <>
      <div className="me-2 ms-2">
        <div className="mb-2 d-flex justify-content-around">
          <NavLink
            className={({ isActive }) =>
              `text-decoration-none tab ${isActive && "tabFocus"}`
            }
            to={
              id
                ? `/member-profile${`/${id}`}/dashboard/profile`
                : `/${role}/dashboard/profile`
            }
          >
            Profile
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `text-decoration-none tab ${isActive && "tabFocus"}`
            }
            to={
              id
                ? `/member-profile${`/${id}`}/dashboard/details/savings`
                : `/${role}/dashboard/details/savings`
            }
          >
            Savings
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `text-decoration-none tab ${isActive && "tabFocus"}`
            }
            to={
              id
                ? `/member-profile${`/${id}`}/dashboard/details/loan`
                : `/${role}/dashboard/details/loan`
            }
          >
            Loan
          </NavLink>
        </div>
        <Outlet />
      </div>
    </>
  );
}
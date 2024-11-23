import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Host, Details, Members, Profile, Signin, UserDashboard, AddMember, MemberProfile, UpdateDetails, AuthLayout, Member } from "./components";
import { Provider } from 'react-redux';
import store from './store/store.js';
// import TestForOTP from './components/TestForOTP.jsx';

const router = createBrowserRouter ([
  // {
  //   path: "/test-otp",
  //   element: (
  //     <TestForOTP />
  //   )
  // },
  {
    path: "/",
    element: (
      <AuthLayout>
        <App />
      </AuthLayout>
    ),
    children: [
      {
        path: "/login",
        element: (
          <AuthLayout>
            <Signin />
          </AuthLayout>
        )
      },
      {
        path: "host",
        element: (
          <AuthLayout>
            <Host />
          </AuthLayout>
        ),
        children: [
          {
            path: "dashboard",
            element: <UserDashboard />,
            children: [
              {
                path: "profile",
                element: <Profile />
              },
              {
                path: "details/:of",
                element: <Details />
              },
            ]
          },
          {
            path: "members",
            element: <Members />,
            children: [
              {
                path: "add-member",
                element: <AddMember />
              },
            ]
          },
          {
            path: "update/:what",
            element: <UpdateDetails />
          },
        ]
      },
      {
        path: "member",
        element: <Member/>,
        children: [
          {
            path: "dashboard",
            element: <UserDashboard />,
            children: [
              {
                path: "profile",
                element: <Profile />
              },
              {
                path: "details/:of",
                element: <Details />
              },
            ]
          },
        ]
      },
      {
        path: "/member-profile/:id",
        element: (
          <AuthLayout>
            <MemberProfile />
          </AuthLayout>
        ),
        children: [
          {
            path: "dashboard",
            element: <UserDashboard />,
            children: [
              {
                path: "profile",
                element: <Profile />
              },
              {
                path: "details/:of",
                element: <Details />
              },
            ]
          },
        ]
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>,
)
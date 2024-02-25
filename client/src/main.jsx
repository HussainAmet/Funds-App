import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Admin, Details, Members, Profile, Signin, UserDashboard, AddMember, MemberProfile, UpdateDetails, AuthLayout } from "./components"
import { Provider } from 'react-redux'
import store from './store/store.js'

const router = createBrowserRouter ([
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
        path: "/dashboard",
        element: (
          <AuthLayout>
            <UserDashboard />
          </AuthLayout>
        ),
        children: [
          {
            path: "details/:of",
            element: <Details />
          },
          {
            path: "profile",
            element: <Profile />
          },
        ]
      },
      {
        path: "/admin",
        element: (
          <AuthLayout>
            <Admin />
          </AuthLayout>
        ),
        children: [
          {
            path: "profile",
            element: <Profile />,
            children: [
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
        path: "/member-profile/:id",
        element: (
          <AuthLayout>
            <MemberProfile />
          </AuthLayout>
        ),
        children: [
          {
            path: "details/:of",
            element: <Details />
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
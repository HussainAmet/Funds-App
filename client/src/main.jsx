import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Admin, Details, Members, Profile, Signin, UserDashboard, AddMember, MembersList, MemberProfile } from "./components"
import { Provider } from 'react-redux'
import store from './store/store.js'

const router = createBrowserRouter ([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Signin />
      },
      {
        path: "/dashboard",
        element: <UserDashboard />,
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
        element: <Admin />,
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
            path: "add-savings",
            element: <Members />
          },
          {
            path: "give-loan",
            element: <Members />
          },
          {
            path: "add-loan-installment",
            element: <Members />
          },
        ]
      },
      {
        path: "/member-profile/:id",
        element: <MemberProfile />,
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
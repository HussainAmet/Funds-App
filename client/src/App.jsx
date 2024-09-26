import React, { useEffect } from 'react'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <div>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  )
}

export default App

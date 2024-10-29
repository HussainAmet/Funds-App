import React from 'react'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <div className='d-flex flex-column h-100'>
        <div className='flex-grow-1'>
          <Header />
          <main>
            <Outlet />
          </main>
        </div>
        <div className='sticky-bottom'>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App

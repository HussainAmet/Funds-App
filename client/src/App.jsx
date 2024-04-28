import React from 'react'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <div>
      <div>
        <header>
          <Header />
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  )
}

export default App

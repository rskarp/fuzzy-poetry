import { Outlet } from 'react-router'
import './App.css'
import Navbar from './components/navbar'
import { useMemo } from 'react'

const App = () => {

  const curYear = useMemo(() => {
    return new Date().getFullYear()
  }, [])

  return (
    <>
      <div data-theme="dark" className="root">
        <Navbar />
        
        <div className="p-5 bg-base-200 content">
          <Outlet />
        </div>

        <footer className="footer footer-center p-4 bg-base-300 text-base-content rounded-t-sm">
          <div>
            <p>Copyright © {curYear} - All rights reserved by Fuzzy Poetry Project</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App

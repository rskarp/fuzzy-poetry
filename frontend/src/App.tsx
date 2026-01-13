import { Outlet } from 'react-router'
import './App.css'
import Navbar from './components/app/navbar'
import { useEffect, useMemo, useRef } from 'react'
import { useDetailedHealthCheckHealthDetailedGet } from './api'

const App = () => {

  const curYear = useMemo(() => {
    return new Date().getFullYear()
  }, []);

  const {data: apiHealth} = useDetailedHealthCheckHealthDetailedGet();
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    if (apiHealth && !hasLoggedRef.current) {
      console.log("API Health:", apiHealth);
      hasLoggedRef.current = true;
    }
  }, [apiHealth]);

  return (
      <div data-theme="dark" className="root w-full min-h-screen flex flex-col">
        <Navbar />

        <div className="text-left p-4 bg-base-200 flex-1">
          <Outlet />
        </div>

        <footer className="footer footer-center p-4 bg-base-300 text-base-content rounded-t-sm">
          <div>
            <p>Copyright © {curYear} - All rights reserved by Fuzzy Poetry Project</p>
          </div>
        </footer>
      </div>
  )
}

export default App

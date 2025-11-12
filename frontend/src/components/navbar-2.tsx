import { useState } from "react";
import { Link, Outlet } from "react-router";
import "./App.css"; // or copy styles here

export default function NavBar2() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="drawer wrapper">
      {/* Drawer Toggle */}
      <input
        id="my-drawer-3"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={() => setDrawerOpen(!drawerOpen)}
        style={{ display: "none" }}
      />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <header style={{ fontFamily: "'Rubik Beastly', cursive" }}>
          <div className="w-full navbar bg-base-300 rounded-b-sm">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                className="btn btn-square btn-ghost"
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2 mx-2 text-green-400">
              <Link to="/">Fuzzy Poetry</Link>
            </div>
            <div className="flex-none hidden lg:block">
              <nav>
                <ul className="menu menu-horizontal text-secondary">
                  <li><Link to="/">Home</Link></li>
                  <li>
                    {/* Dropdown Menu */}
                    <span>About</span>
                    <ul className="text-secondary z-50">
                      <div className="bg-base-300 w-40 p-1 flex flex-col">
                        <Link to="/overview">Project Overview</Link>
                        <Link to="/context">Context</Link>
                        <Link to="/contributors">Contributors</Link>
                      </div>
                    </ul>
                  </li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        {/* Page content here */}
        <div id="page-content">
          <Outlet />
        </div>
      </div>

      {/* Drawer Side */}
      {drawerOpen && (
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            className="drawer-overlay"
            onClick={() => setDrawerOpen(false)}
          ></label>
          <ul className="menu p-4 w-80 bg-base-100 text-secondary">
            <nav>
              <li><Link to="/">Home</Link></li>
              <li>
                <span>About</span>
                <ul className="text-secondary">
                  <div className="w-40 p-1 ml-6 flex flex-col">
                    <Link to="/overview">Project Overview</Link>
                    <Link to="/context">Context</Link>
                    <Link to="/contributors">Contributors</Link>
                  </div>
                </ul>
              </li>
              <li><Link to="/contact">Contact</Link></li>
            </nav>
          </ul>
        </div>
      )}

      <footer className="footer footer-center p-4 bg-base-300 text-base-content rounded-t-sm">
        <div>
          <p>Copyright © 2025 - All rights reserved by Fuzzy Poetry Project</p>
        </div>
      </footer>
    </div>
  );
}
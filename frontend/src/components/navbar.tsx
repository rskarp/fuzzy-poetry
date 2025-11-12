import { Link } from "react-router";
import { Path } from "../router/path";

const NavBar = () => {
    
  return (
    <>
        <header style={{ fontFamily: "'Rubik Beastly', cursive" }}>
          <div className="w-full navbar bg-base-300 rounded-b-sm">
            {/* <div className="flex-none lg:hidden">
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
            </div> */}
            <div className="flex-1 px-2 mx-2 text-green-400">
              <Link to="/">Fuzzy Poetry</Link>
            </div>
            <div className="flex-none hidden lg:block">
              <nav>
                <ul className="menu menu-horizontal text-secondary">
                  <li><Link to={Path.Home}>Home</Link></li>
                  <li>
                    {/* Dropdown Menu */}
                    <span>About</span>
                    <ul className="text-secondary z-50">
                      <div className="bg-base-300 w-40 p-1 flex flex-col">
                        <Link to={Path.Overview}>Project Overview</Link>
                        <Link to={Path.Context}>Context</Link>
                        <Link to={Path.Contributors}>Contributors</Link>
                      </div>
                    </ul>
                  </li>
                  <li><Link to={Path.Contact}>Contact</Link></li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
    </>
  );
};

export default NavBar;
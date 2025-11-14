import { Link } from "react-router";
import { Path } from "../../router/path";

const NavBar = () => {
    
  return (
    <>
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start flex-1">
                <div className="btn btn-ghost text-xl"><Link to={Path.Root}>Fuzzy Poetry</Link></div>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                <li><Link to={Path.Home}>Home</Link></li>
                <li>
                    <details>
                    <summary>About</summary>
                    <ul className="bg-base-100 rounded-t-none p-2">
                        <li><Link to={Path.Overview}>Project Overview</Link></li>
                        <li><Link to={Path.Context}>Context</Link></li>
                        <li><Link to={Path.Contributors}>Contributors</Link></li>
                    </ul>
                    </details>
                </li>
                <li><Link to={Path.Contact}>Contact</Link></li>
                </ul>
            </div>
        </div>
    </>
  );
};

export default NavBar;
import { Link } from "react-router";
import { Path } from "../../router/path";

const NavBar = () => {
    
  return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start flex-1">
                <h1 className="btn btn-ghost text-xl"><Link to={Path.Root} className="!no-underline">Fuzzy Poetry</Link></h1>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                <li><Link to={Path.Home} className="!no-underline">Home</Link></li>
                <li>
                    <details>
                    <summary className="text-green-400">About</summary>
                    <ul className="bg-base-100 rounded-t-none p-2">
                        <li><Link to={Path.Overview} className="!no-underline">Project Overview</Link></li>
                        <li><Link to={Path.Context} className="!no-underline">Context</Link></li>
                        <li><Link to={Path.Contributors} className="!no-underline">Contributors</Link></li>
                    </ul>
                    </details>
                </li>
                <li><Link to={Path.Contact} className="!no-underline">Contact</Link></li>
                </ul>
            </div>
        </div>
  );
};

export default NavBar;
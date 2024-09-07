import "./Header.css";
import { Link } from "react-router-dom";

export default function Header({ title }){
    return (
        <>
            <div className="headerTitle">{title}</div>
            <div className="headerNavMenu">
                <Link className="headerNavItem" to="/">Home</Link>
                <Link className="headerNavItem" to="/search">Graph Algorithms</Link>
                <Link className="headerNavItem" to="/tree">Tree</Link>
            </div>
        </>
    );
};
import "../App.css"
import SignUp from "./SignUp";
import Login from "./Login";
import { Link } from 'react-router-dom';
import { useState } from "react";
import * as Icons from "../assets/Icons"
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import SignOutButton from "./SignOut";

function Layout({children}) {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };
    const { currentUser } = useContext(AuthContext);
    const links = [
        {
            icon: <Icons.MdLocationPin />,
            label: "Bern, Switzerland",
            href: "",
        },
        {
            icon: <Icons.MdEmail />,
            label: "Email",
            href: "mailto:example@example.com",
        },
        {
            icon: <Icons.FaGoogleScholar />,
            label: "Google Scholar",
            href: "https://scholar.google.com",
        },
        {
            icon: <Icons.FaGithub />,
            label: "Github",
            href: "https://github.com",
        },
        {
            icon: <Icons.FaLinkedin />,
            label: "Linkedin",
            href: "https://linkedin.com",
        },
    ];
    return (
        <div className="App">
            <div className="header">
                {/* <SignUp /> */}
                
                <Link to={'/'}><h2>Alejandro Flores</h2></Link>
                <div className="nav-section">
                  <div className="nav">
                    <Link to={'/coursework'}>Coursework</Link>
                    <Link to={'/blog-posts'}>Blog Posts</Link>
                    <Link to={'/portfolio'}>Portfolio</Link>
                    <Link to={'/cv'}>CV</Link>
                </div> 
                <div className="contact-btn">Contact me</div> 
                </div>
            </div>
            <div className="main">
                <div className="sideBar">
                    <div style={{display: "flex", justifyContent: "center"}}>
                    <div className="user-img"></div>
                    </div>
                    <div className="user-info">
                        <p>Ph.D. in Cheminformatics<br/> Machine Learning <br/>Data Visualization</p>
                    </div>
                    <div className="links">
                        {links.map((link, index) => (
                            <div className="link" key={index}>
                                <div className="icon">{link.icon}</div>
                                <a href={link.href}>{link.label}</a>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="content">{children}</div>
            </div>
            <div className="footer">
                {currentUser 
                    ? <div className="inline"><SignOutButton />Logout</div> 
                    : <div className="admin">
                    <Icons.FaUserCircle className="user-icon" onClick={toggleDropdown} />
                    Administrator Access
                    {dropdownVisible && (
                    <div className="dropdown-menu">
                        <Login />
                    </div>
                )}
                </div>}
                
            </div>
        </div>
    )
}
export default Layout;
import { Link } from "react-router-dom";

function Header(){

    return(
        <header className = "header">
            <h1>Tom Builds Tech</h1>
            <h3><Link to="/about">ABOUT</Link> | <Link to = "/projects">PROJECTS</Link> | <Link to ="/blog">BLOG</Link></h3>       
        </header>
    );
}

export default Header
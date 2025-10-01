import { projects } from "./data/projects";
import { Link } from "react-router-dom";

function Projects() {

    return(
        <div>
            <div className="separator"></div>
            <h2>Projects</h2>
            {projects.map((p) => (
                <div key={p.id} className="project-card">
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <p><strong>Tech: </strong> {p.tech.join(", ")}</p>
                    <a href={p.github}>GitHub Repo</a>
                    <span><br /></span>
                    {p.demo && (
                        <Link to={p.demo} className="demo-link">
                            View Demo
                        </Link>
          )}
                    <div className="separator"></div>
                </div>
            ))}
        </div>
        
    );
}

export default Projects
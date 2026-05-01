import { Link } from "react-router-dom";
import "./Page404.css";

export function Page404() {

    return (
        <div className="Page404">
            <div className="Page404__card">
                <span>404</span>
                <h1>Recipe not found</h1>
                <p>The page you are looking for does not exist or has been moved.</p>
                <Link className="primary-button" to="/">Back Home</Link>
            </div>
        </div>
    );
}

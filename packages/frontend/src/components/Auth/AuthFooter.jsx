import { Link } from "react-router-dom";

function AuthFooter({
    text,
    linkText,
    link
}) {
    return (
        <p>

            {text}{" "}

            <Link to={link}>
                {linkText}
            </Link>

        </p>
    );
}

export default AuthFooter;
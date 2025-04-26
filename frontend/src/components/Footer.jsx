import { Link } from "react-router-dom";

import "./Layout.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link
            to="/"
            className="footer-link"
          >
            Home
          </Link>
          <Link
            to="/quizzes"
            className="footer-link"
          >
            Quizzes
          </Link>
          <Link
            to="/create-quiz"
            className="footer-link"
          >
            Create
          </Link>
        </div>
        <p className="copyright">
          © {new Date().getFullYear()} Quiz Challenge. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import Footer from "./Footer";
import Header from "./Header";
import "./Layout.css";

const Layout = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark-theme",
      darkTheme
    );
    document.body.classList.toggle("dark-theme", darkTheme);
    localStorage.setItem("theme", darkTheme ? "dark" : "light");
  }, [darkTheme]);

  const toggleTheme = () => {
    setDarkTheme(prev => !prev);
  };

  return (
    <div className="app-container">
      <Header
        darkTheme={darkTheme}
        toggleTheme={toggleTheme}
      />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

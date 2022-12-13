import type { Component } from "solid-js";

import styles from "./Navbar.module.css";

const pages = {
  "Now Playing": "/",
  Library: "/library",
  Community: "/community",
};

const Navbar: Component = () => {
  return (
    <nav class={styles.Nav}>
      {Object.entries(pages).map(([k, v]) => (
        <a href={v}>{k}</a>
      ))}
    </nav>
  );
};

export default Navbar;

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
      <div class={styles.NavPages}>
        {Object.entries(pages).map(([k, v]) => (
          <a
            href={v}
            class={styles.NavPage}
            data-highlight={window.location.pathname == v}
          >
            {k}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

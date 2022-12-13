import type { Component } from "solid-js";

import styles from "./App.module.css";
import Navbar from "./Navbar";

const App: Component = () => {
  return (
    <main class={styles.App}>
      <Navbar />
    </main>
  );
};

export default App;

import type { Component } from "solid-js";

import { Routes, Route } from "@solidjs/router";

import styles from "./App.module.css";
import Navbar from "./Navbar";
import Player from "./Player";
import Home from "./pages/Home";

const App: Component = () => {
  return (
    <main class={styles.App}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
      <Player />
    </main>
  );
};

export default App;

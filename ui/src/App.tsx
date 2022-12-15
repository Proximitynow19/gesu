import type { Component } from "solid-js";

import { Routes, Route } from "@solidjs/router";

import styles from "./App.module.css";
import Navbar from "./Navbar";
import Player from "./Player";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Community from "./pages/Community";

const App: Component = () => {
  return (
    <main class={styles.App}>
      <Navbar />
      <section class={styles.Page}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/library" element={<Library />}></Route>
          <Route path="/community" element={<Community />}></Route>
        </Routes>
      </section>
      <div class={styles.Player}>
        <Player />
      </div>
    </main>
  );
};

export default App;

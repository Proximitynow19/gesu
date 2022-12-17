import { Component } from "solid-js";

import { Routes, Route, useIsRouting } from "@solidjs/router";

import { Motion, Presence } from "@motionone/solid";
import { Rerun } from "@solid-primitives/keyed";

import styles from "./App.module.css";
import Navbar from "./Navbar";
import Player, { getAudio } from "./Player";
import Home from "./pages/Home";
import WIP from "./pages/WIP";
import Visualizer from "./Visualizer";

const App: Component = () => {
  return (
    <main class={styles.App}>
      <Navbar />{" "}
      <Presence exitBeforeEnter>
        <Rerun on={useIsRouting()}>
          <Motion
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.05 } }}
            transition={{ duration: 0.1 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <section class={styles.Page}>
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route
                  path="/library"
                  element={<WIP page_name="Library" />}
                ></Route>
                <Route
                  path="/community"
                  element={<WIP page_name="Community" />}
                ></Route>
              </Routes>
            </section>
          </Motion>
        </Rerun>
      </Presence>
      <div class={styles.Visualizer}>
        <Visualizer audio={getAudio} />
      </div>
      <div class={styles.Player}>
        <Player />
      </div>
    </main>
  );
};

export default App;

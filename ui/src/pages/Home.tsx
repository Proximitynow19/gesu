import { Motion, Presence } from "@motionone/solid";
import { Rerun } from "@solid-primitives/keyed";
import { Component } from "solid-js";
import { getSong } from "../Player";

import styles from "./Home.module.css";

const Home: Component = () => {
  return (
    <>
      <div></div>
      <div>
        <img
          src={`https://api.gesugao.net/now_playing/art?${encodeURIComponent(
            getSong().text
          )}`}
          alt="Now Playing Art"
          class={styles.NowPlayingArt}
        />
        <Presence exitBeforeEnter>
          <Rerun on={getSong}>
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.05 } }}
              transition={{ duration: 0.1 }}
              exit={{ opacity: 0 }}
            >
              <div>
                <h1>{getSong().title}</h1>
                <h3>{getSong().artist}</h3>
              </div>
            </Motion>
          </Rerun>
        </Presence>
      </div>
      <div></div>
    </>
  );
};

export default Home;

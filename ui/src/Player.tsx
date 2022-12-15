import type { Component } from "solid-js";

import styles from "./Player.module.css";

const Player: Component = () => {
  return (
    <div>
      <audio
        src={"https://a.gesugao.net/"}
        controls={true}
        autoplay={true}
      ></audio>
    </div>
  );
};

export default Player;

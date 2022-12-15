import type { Component } from "solid-js";

import styles from "./Home.module.css";

const Home: Component = () => {
  return (
    <div>
      <div>We're still building the site.</div>
      <div>
        Join our Discord server{" "}
        <a
          href="https://s.gesugao.net/discord"
          target="_blank"
          class={styles.DiscordLink}
        >
          here
        </a>{" "}
        for updates.
      </div>
      <br />
      <br />
      <br />
      <div>Homepage</div>
    </div>
  );
};

export default Home;

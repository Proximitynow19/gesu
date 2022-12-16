import type { Component } from "solid-js";

import styles from "./WIP.module.css";

type WIPProps = { page_name: string };

const WIP: Component<WIPProps> = (props: WIPProps) => {
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
      <div>{props.page_name}</div>
    </div>
  );
};

export default WIP;

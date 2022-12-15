import { Component, createEffect, createRoot, createSignal } from "solid-js";
import io from "socket.io-client";

import styles from "./Player.module.css";

import { TbPlayerPlay, TbPlayerStop } from "solid-icons/tb";
import { FiVolumeX, FiVolume1, FiVolume2 } from "solid-icons/fi";
import moment from "moment";

const [isPlaying, setPlaying] = createSignal(false);
const [getVol, setVol] = createSignal(0.5);
const [getSong, setSong] = createSignal({
  title: "",
  artist: "",
  text: "",
  start: moment().toISOString(),
  end: moment().toISOString(),
});

if ("mediaSession" in navigator) {
  navigator.mediaSession.setActionHandler("play", () => {
    setPlaying(true);
  });
  navigator.mediaSession.setActionHandler("pause", () => {
    setPlaying(false);
  });
  navigator.mediaSession.setActionHandler("stop", () => {
    setPlaying(false);
  });
}

createRoot(() => {
  const socket = io("https://api.gesugao.net/");

  socket.on("now_playing", (data) => {
    setSong(data);

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: data.title,
        artist: data.artist,
        album: "gesugao.net",
        artwork: [
          {
            src: `https://api.gesugao.net/now_playing/art?${encodeURIComponent(
              data.text
            )}`,
            sizes: "500x500",
            type: "image/jpeg",
          },
        ],
      });

      navigator.mediaSession.playbackState = isPlaying() ? "playing" : "paused";
    }
  });

  let audio: HTMLAudioElement | undefined;

  createEffect(async () => {
    if (isPlaying()) {
      if (!audio) audio = new Audio();
      audio.src = `https://a.gesugao.net/?${Date.now()}`;
      audio.volume = getVol();
      audio.load();
      await audio.play().catch(() => {
        setPlaying(false);
      });

      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "playing";
    } else {
      if (!audio) return;
      audio.pause();

      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "paused";
    }
  });
});

const Player: Component = () => {
  return (
    <div class={styles.Container}>
      <img
        src={`https://api.gesugao.net/now_playing/art?${encodeURIComponent(
          getSong().text
        )}`}
        alt="Now Playing Art"
        class={styles.Art}
      />
      <div class={styles.MetaContainer}>
        <strong class={styles.MetaTitle}>{getSong().title}</strong>
        <span class={styles.MetaArtist}>{getSong().artist}</span>
      </div>
      <div onClick={() => setPlaying(!isPlaying())} class={styles.Toggle}>
        {isPlaying() ? <TbPlayerStop /> : <TbPlayerPlay />}
      </div>
      <div class={styles.Volume}>
        {getVol() > 0 ? (
          getVol() < 0.5 ? (
            <FiVolume1 />
          ) : (
            <FiVolume2 />
          )
        ) : (
          <FiVolumeX />
        )}
      </div>
    </div>
  );
};

export default Player;

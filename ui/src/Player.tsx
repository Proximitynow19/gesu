import { Component, createEffect, createRoot, createSignal } from "solid-js";
import io from "socket.io-client";

import styles from "./Player.module.css";

import { TbPlayerPlay, TbPlayerStop } from "solid-icons/tb";
import { FiVolumeX, FiVolume1, FiVolume2 } from "solid-icons/fi";
import { ImSpinner2 } from "solid-icons/im";
import moment from "moment";
import { Motion, Presence } from "@motionone/solid";
import { Rerun } from "@solid-primitives/keyed";

const [isPlaying, setPlaying] = createSignal(false);
const [getVol, setVol] = createSignal(0.5);
const [isLoading, setLoading] = createSignal(false);
export const [getSong, setSong] = createSignal({
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
            sizes: "800x800",
            type: "image/jpeg",
          },
        ],
      });

      navigator.mediaSession.playbackState = isPlaying() ? "playing" : "paused";
    }
  });

  let audio: HTMLAudioElement | undefined;

  createEffect(async () => {
    if (!audio || audio.paused == isPlaying()) {
      setLoading(true);

      if (isPlaying()) {
        if (!audio || audio.paused) {
          audio = new Audio();
          audio.src = `https://a.gesugao.net/?${Date.now()}`;
          audio.volume = getVol();
          audio.load();
          await audio.play().catch(() => {
            setPlaying(false);
          });
        }
      } else {
        if (audio && !audio.paused) {
          audio.pause();
        }
      }

      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = isPlaying()
          ? "playing"
          : "paused";

      setLoading(false);
    }

    if (audio) audio.volume = getVol();
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
      <Presence exitBeforeEnter>
        <Rerun on={getSong}>
          <Motion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.05 } }}
            transition={{ duration: 0.1 }}
            exit={{ opacity: 0 }}
          >
            <div class={styles.MetaContainer}>
              <strong class={styles.MetaTitle}>{getSong().title}</strong>
              <span class={styles.MetaArtist}>{getSong().artist}</span>
            </div>
          </Motion>
        </Rerun>
      </Presence>
      <div
        onClick={() => isLoading() || setPlaying(!isPlaying())}
        class={styles.Toggle}
        data-loading={isLoading()}
      >
        {isLoading() ? (
          <Motion
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <ImSpinner2 />
          </Motion>
        ) : isPlaying() ? (
          <TbPlayerStop />
        ) : (
          <TbPlayerPlay />
        )}
      </div>
      <div
        onClick={() => setVol((getVol() + 0.2) % 1)}
        class={styles.Volume}
        title={`${Math.round(getVol() * 100)}%`}
      >
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

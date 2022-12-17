import { Accessor, Component, createEffect } from "solid-js";
import d3 from "d3";

import styles from "./Visualizer.module.css";

type VisualizerProps = {
  audio: Accessor<HTMLAudioElement>;
  samples: number;
};

const Visualizer: Component<VisualizerProps> = (props: VisualizerProps) => {
  createEffect(() => {
    if (!props.audio()) return;

    let audioCtx = new window.AudioContext();
    let audioSrc = audioCtx.createMediaElementSource(props.audio());
    let analyser = audioCtx.createAnalyser();
    analyser.fftSize = Math.min(
      Math.max(32, 2 ** (Math.ceil(Math.log(props.samples) / Math.log(2)) + 1)),
      32768
    );

    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);

    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    console.log(Array.from(dataArray));
  });

  return <></>;
};

export default Visualizer;

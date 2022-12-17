import { Accessor, Component, onMount } from "solid-js";

import styles from "./Visualizer.module.css";

type VisualizerProps = {
  audio: Accessor<HTMLAudioElement>;
};

const Visualizer: Component<VisualizerProps> = (props: VisualizerProps) => {
  let canvas: HTMLCanvasElement | undefined;

  onMount(() => {
    // Create an audio context and an analyser node
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();

    // Connect the audio element to the analyser
    const source = audioContext.createMediaElementSource(props.audio());
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    if (!canvas) return;

    // Set up the canvas for drawing the visualizer
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Create an array to store the audio data
      const data = new Uint8Array(analyser.frequencyBinCount);

      // Draw the visualizer on the canvas
      const draw = () => {
        if (!canvas) return;
        // Set the canvas dimensions to match the audio element
        canvas.width = window.innerWidth;
        canvas.height = (window.innerHeight * 2) / 3;

        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(data);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.beginPath();

        const step = Math.ceil(data.length / (window.innerWidth / 50));

        for (let i = 0; i < data.length; i += step) {
          const slice = data.slice(i, i + step);
          const average = slice.reduce((a, b) => a + b, 0) / slice.length;
          const x = i * (canvas.width / data.length);
          const y = (average / 255) * canvas.height;

          // If this is the first point, move to it without drawing a line
          if (i === 0) {
            ctx.moveTo(x, canvas.height - y);
          }
          // Otherwise, draw a bezier curve to the next point using the current and next points as control points
          else {
            const nextX = (i + step) * (canvas.width / data.length);
            const nextY = (average / 255) * canvas.height;

            // Calculate the control points for the curve using a range of data points
            const controlPoint1X = x + (nextX - x) / 3;
            let controlPoint1Y = 0;
            for (let j = i - 3; j <= i + 3; j++) {
              if (j >= 0 && j < data.length) {
                controlPoint1Y += (data[j] / 255) * canvas.height;
              }
            }
            controlPoint1Y /= 7;
            controlPoint1Y = canvas.height - controlPoint1Y;
            const controlPoint2X = nextX - (nextX - x) / 3;
            let controlPoint2Y = 0;
            for (let j = i + step; j <= i + step + 2; j++) {
              if (j >= 0 && j < data.length) {
                controlPoint2Y += (data[j] / 255) * canvas.height;
              }
            }
            controlPoint2Y /= 3;
            controlPoint2Y = canvas.height - controlPoint2Y;

            ctx.bezierCurveTo(
              controlPoint1X,
              controlPoint1Y,
              controlPoint2X,
              controlPoint2Y,
              nextX,
              canvas.height - nextY
            );
          }
        }

        ctx.stroke();
      };

      // Start the visualizer
      draw();
    }
  });

  return <canvas ref={canvas} />;
};

export default Visualizer;
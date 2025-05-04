import { useEffect, useRef } from "react";

export default function Visualizer({ audio }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (!audio) return;

    if (!contextRef.current) {
      contextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const audioContext = contextRef.current;

    if (!sourceRef.current) {
      sourceRef.current = audioContext.createMediaElementSource(audio);
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }

    const analyser = audioContext.createAnalyser();
    sourceRef.current.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  }, [audio]);

  return <canvas ref={canvasRef} width={600} height={300} />;
}

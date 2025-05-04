import { useEffect, useRef, useState } from "react";

export default function Visualizer({ audio, type = "bars" }) {
  const canvasRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);

  useEffect(() => {
    if (!audio) return;

    if (!audioContext) {
      const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
      const newAnalyser = newAudioContext.createAnalyser();
      setAudioContext(newAudioContext);
      setAnalyser(newAnalyser);
    }

    if (audioContext && analyser) {
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const drawBars = () => {
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

      const drawWaveform = () => {
        analyser.getByteTimeDomainData(dataArray);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ff5733";
        ctx.beginPath();

        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * canvas.height / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      };

      const drawRadial = () => {
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(canvas.width, canvas.height) / 2;

        const circleCount = 50; 
        const radiusStep = maxRadius / circleCount;

        for (let i = 0; i < circleCount; i++) {
          const radius = i * radiusStep;
          const value = dataArray[i] / 255; 

          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(255, 87, 51, ${value})`; // Transparência com base na intensidade
          ctx.lineWidth = 2 + value * 5; // Espessura do círculo
          ctx.stroke();
        }
      };

      const draw = () => {
        requestAnimationFrame(draw);

        if (type === "bars") drawBars();
        if (type === "waveform") drawWaveform();
        if (type === "radial") drawRadial();
      };

      draw();
    }

    return () => {
      if (audioContext) {
        audioContext.close(); 
      }
    };
  }, [audio, audioContext, analyser, type]);

  return <canvas ref={canvasRef} width={600} height={300} />;
}
//aqui
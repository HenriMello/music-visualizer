import { useRef } from "react";

export default function AudioLoader({ onAudioReady }) {
  const audioRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    audioRef.current.src = fileUrl;
    audioRef.current.play();
    onAudioReady(audioRef.current);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>🎧 Faça upload da sua música</h2>
      <input type="file" accept="audio/*" onChange={handleFile} />
      <br />
      <audio ref={audioRef} controls style={{ marginTop: "10px" }} />
    </div>
  );
}

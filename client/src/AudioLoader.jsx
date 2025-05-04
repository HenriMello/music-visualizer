import { useRef, useState } from "react";

export default function AudioLoader({ onAudioReady }) {
  const audioRef = useRef();
  const [url, setUrl] = useState("");

  const handleYouTube = () => {
    if (!url) return;
    const streamUrl = `http://localhost:4000/audio?url=${encodeURIComponent(url)}`;
    audioRef.current.src = streamUrl;
    audioRef.current.play();
    onAudioReady(audioRef.current);
  };

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
      <h2>🎧 Escolha sua música</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Paste here the youtube link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
        <button onClick={handleYouTube}>Play from Youtube</button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input type="file" accept="audio/*" onChange={handleFile} />
      </div>

      <audio ref={audioRef} controls />
    </div>
  );
}

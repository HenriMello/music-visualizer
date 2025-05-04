import { useState } from "react";
import AudioLoader from "./AudioLoader";
import Visualizer from "./Visualizer";

function App() {
  const [audioEl, setAudioEl] = useState(null);

  return (
    <div style={{ padding: "20px", backgroundColor: "#111", color: "#fff" }}>
      <h1>🎵 Music Visualizer</h1>
      <AudioLoader onAudioReady={setAudioEl} />
      {audioEl && <Visualizer audio={audioEl} />}
    </div>
  );
}

export default App;

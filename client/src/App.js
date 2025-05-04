import { useState } from "react";
import AudioLoader from "./AudioLoader";
import Visualizer from "./Visualizer";

function App() {
  const [audioEl, setAudioEl] = useState(null);
  const [visualizationType, setVisualizationType] = useState("bars");

  const handleVisualizationChange = (type) => {
    if (!audioEl) setVisualizationType(type); // só muda se nenhum áudio estiver carregado
  };

  const isVisualizationLocked = !!audioEl; // true se o áudio já foi selecionado

  return (
    <div style={{ padding: "20px", backgroundColor: "#111", color: "#fff" }}>
      <h1>🎵 Music Visualizer</h1>

      {/* Botões de visualização (bloqueados após seleção de música) */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => handleVisualizationChange("bars")}
          disabled={isVisualizationLocked}
          style={{
            marginRight: "10px",
            padding: "10px",
            backgroundColor: visualizationType === "bars" ? "#ff5733" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: isVisualizationLocked ? "not-allowed" : "pointer",
            opacity: isVisualizationLocked ? 0.5 : 1,
          }}
        >
          Barras
        </button>

        <button
          onClick={() => handleVisualizationChange("waveform")}
          disabled={isVisualizationLocked}
          style={{
            marginRight: "10px",
            padding: "10px",
            backgroundColor: visualizationType === "waveform" ? "#ff5733" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: isVisualizationLocked ? "not-allowed" : "pointer",
            opacity: isVisualizationLocked ? 0.5 : 1,
          }}
        >
          Onda
        </button>

        <button
          onClick={() => handleVisualizationChange("radial")}
          disabled={isVisualizationLocked}
          style={{
            padding: "10px",
            backgroundColor: visualizationType === "radial" ? "#ff5733" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: isVisualizationLocked ? "not-allowed" : "pointer",
            opacity: isVisualizationLocked ? 0.5 : 1,
          }}
        >
          Círculos
        </button>
      </div>

      <AudioLoader onAudioReady={setAudioEl} />
      {audioEl && <Visualizer audio={audioEl} type={visualizationType} />}
    </div>
  );
}

export default App;

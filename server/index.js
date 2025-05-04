const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/audio", async (req, res) => {
  const videoURL = req.query.url;

  if (!videoURL || !ytdl.validateURL(videoURL)) {
    return res.status(400).send("URL inválida.");
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const format = ytdl.filterFormats(info.formats, 'audioonly').find(f =>
      f.mimeType.includes('audio/mp4')
    );
    

    res.setHeader("Content-Disposition", 'inline; filename="audio.mp3"');
    res.setHeader("Content-Type", "audio/mp4");
    ytdl(videoURL, { format }).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao processar o vídeo.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

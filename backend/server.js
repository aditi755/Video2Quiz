
const { YoutubeTranscript } = require('youtube-transcript');
const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 3000;

// Use middleware to parse JSON bodies and enable CORS
app.use(express.json());

//const frontendUrl = 'https://video2-quiz.vercel.app/';

app.use(cors({
  origin: ['https://video2-quiz.vercel.app/'],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(express.json());


async function fetchTranscript(videoUrl) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    const cleanedTranscript = transcript.map(entry => entry.text.replace(/&#?\w+;/g, ' ').trim()).join('\n');
    fs.writeFileSync('transcript.txt', cleanedTranscript);
    console.log('Transcript fetched and saved to transcript.txt');
    return cleanedTranscript;
  } catch (error) {
    console.error('Failed to fetch transcript', error);
    return null;
  }
}

app.post('/transcript', async (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl) {
    return res.status(400).send('Video URL is required');
  }

  const transcriptText = await fetchTranscript(videoUrl);
  if (transcriptText) {
    res.send(transcriptText);
  } else {
    res.status(500).send('Failed to fetch transcript');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


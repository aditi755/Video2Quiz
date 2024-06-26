
// const { YoutubeTranscript } = require('youtube-transcript');
// const express = require('express');
// const fs = require('fs');
// const cors = require('cors'); // Import cors

// const app = express();
// const PORT = 3000;

// // Use middleware to parse JSON bodies and enable CORS
// app.use(express.json());


// app.use(cors({
//   origin: ['https://video2-quiz.vercel.app'],
//   methods: ["POST", "GET"],
//   credentials: true
// }));
// app.use(express.json());


// async function fetchTranscript(videoUrl) {
//   try {
//     const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
//     const cleanedTranscript = transcript.map(entry => entry.text.replace(/&#?\w+;/g, ' ').trim()).join('\n');
//     fs.writeFileSync('transcript.txt', cleanedTranscript);
//     console.log('Transcript fetched and saved to transcript.txt');
//     return cleanedTranscript;
//   } catch (error) {
//     console.error('Failed to fetch transcript', error);
//     return null;
//   }
// }

// app.post('/transcript', async (req, res) => {
//   const { videoUrl } = req.body;
//   if (!videoUrl) {
//     return res.status(400).send('Video URL is required');
//   }


//   try {
//     const transcriptText = await fetchTranscript(videoUrl);
//     res.send(transcriptText);
//   } catch (error) {
//     console.error('Error in /transcript route:', error);
//     res.status(500).send('Failed to fetch transcript');
//   }
// //   const transcriptText = await fetchTranscript(videoUrl);
// //   if (transcriptText) {
// //     res.send(transcriptText);
// //   } else {
// //     res.status(500).send('Failed to fetch transcript');
// //   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// const { YoutubeTranscript } = require('youtube-transcript');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const apiKey = 'AIzaSyA4l9CPHtDAptuqpNB8J_c8u4hIPA-18sA'; // Replace with your actual API key

// app.use(cors({
//   origin: ['https://video2-quiz.vercel.app'],
//   methods: ["POST", "GET"],
//   credentials: true
// }));
// app.use(express.json());

// // Function to fetch transcript from video URL
// async function fetchTranscript(videoUrl) {
//   try {
//     const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
//     const cleanedTranscript = transcript.map(entry => entry.text.replace(/&#?\w+;/g, ' ').trim()).join('\n');
//     fs.writeFileSync('transcript.txt', cleanedTranscript);
//     console.log('Transcript fetched and saved to transcript.txt');
//     return cleanedTranscript;
//   } catch (error) {
//     console.error('Failed to fetch transcript', error);
//     throw error;
//   }
// }

// // Function to generate quiz questions from transcript using AI model
// async function generateQuizQuestions(description) {
//   try {
//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({
//       model: 'gemini-1.5-flash',
//     });

//     const generationConfig = {
//       temperature: 1,
//       topP: 0.95,
//       topK: 64,
//       maxOutputTokens: 8192,
//       responseMimeType: 'text/plain',
//     };

//     const chatSession = model.startChat({
//       generationConfig,
//       history: [
//         {
//           role: 'user',
//           parts: [
//             { text: description }, // Provide the video description here
//           ],
//         },
//       ],
//     });

//     const result = await chatSession.sendMessage(description);
//     const rawResponse = await result.response.text();

//     // Example of parsing the response
//     const jsonMatch = rawResponse.match(/\[.*\]/s);
//     if (!jsonMatch) {
//       throw new Error('No valid JSON array found in the response');
//     }

//     const parsedResponse = JSON.parse(jsonMatch[0]);
//     return parsedResponse;
//   } catch (error) {
//     console.error('Error generating quiz questions:', error);
//     throw error;
//   }
// }

// // POST endpoint to fetch transcript and generate quiz questions
// app.post('/transcript', async (req, res) => {
//   const { videoUrl } = req.body;
//   if (!videoUrl) {
//     return res.status(400).send('Video URL is required');
//   }

//   try {
//     const transcriptText = await fetchTranscript(videoUrl);
//     const quizQuestions = await generateQuizQuestions(transcriptText);

//     res.json(quizQuestions);
//   } catch (error) {
//     console.error('Error in /transcript route:', error);
//     res.status(500).send('Failed to generate quiz questions');
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const { YoutubeTranscript } = require('youtube-transcript');
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
  origin: 'https://video2-quiz.vercel.app',
  methods: ["POST", "GET"],
  credentials: true
}));

const apiKey = 'AIzaSyA4l9CPHtDAptuqpNB8J_c8u4hIPA-18sA';

async function fetchTranscript(videoUrl) {
  try {
    console.log(`Fetching transcript for video URL: ${videoUrl}`);
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    const cleanedTranscript = transcript.map(entry => entry.text.replace(/&#?\w+;/g, ' ').trim()).join('\n');
    fs.writeFileSync('transcript.txt', cleanedTranscript);
    console.log('Transcript fetched and saved to transcript.txt');
    return cleanedTranscript;
  } catch (error) {
    console.error('Failed to fetch transcript', error);
    throw new Error('Failed to fetch transcript');
  }
}

async function generateQuizQuestions(description) {
  try {
    console.log('Generating quiz questions with description:', description);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain',
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            { text: "you will be given a description of the video and you need to return me a JSON object of 5 questions with its options and correct answer that you will generate on basis of the description" },
          ],
        },
        {
          role: 'model',
          parts: [
            { text: "Okay, I'm ready! Please provide me with the description of the video. I will then analyze it and generate 5 multiple-choice questions with options and the correct answer for you." },
          ],
        },
        {
          role: 'user',
          parts: [
            { text: description },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(description);
    const rawResponse = await result.response.text();

    console.log('Raw response from Google Generative AI:', rawResponse);

    const jsonMatch = rawResponse.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in the response');
    }

    const cleanResponse = jsonMatch[0];
    const parsedResponse = JSON.parse(cleanResponse);
    console.log('Parsed quiz questions:', parsedResponse);

    return parsedResponse;
  } catch (error) {
    console.error('Failed to generate quiz questions', error);
    throw new Error('Failed to generate quiz questions');
  }
}

app.post('/transcript', async (req, res) => {
  const { videoUrl } = req.body;
  console.log("videourl", videoUrl)
  console.log('Received video URL:', videoUrl);
  if (!videoUrl) {
    console.error('Video URL is required');
    return res.status(400).send('Video URL is required');
  }

  try {
    const transcriptText = await fetchTranscript(videoUrl);
    if (!transcriptText) {
      console.error('Failed to fetch transcript in /transcript ');
      return res.status(500).send('Failed to fetch transcript');
    }

    const quizQuestions = await generateQuizQuestions(transcriptText);
    console.log('Generated quiz questions:', quizQuestions); // Log the generated quiz questions

    res.json(quizQuestions);
    
  } catch (error) {
    console.error('Error in generateQuizQuestions:', error);
    throw new Error('Failed to generate quiz questions');
  }
});

app.get('/test', (req, res) => {
  res.send('Backend server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





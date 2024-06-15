
// import React, { useState, useEffect } from 'react';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const apiKey = 'AIzaSyA4l9CPHtDAptuqpNB8J_c8u4hIPA-18sA';

// function App() {
//   const [quiz, setQuiz] = useState(null);
//   const [error, setError] = useState(null);
//   const [videoUrl, setVideoUrl] = useState('');

//   // Load quiz data from localStorage on mount
//   useEffect(() => {
//     const savedQuiz = localStorage.getItem('quiz');
//     const savedVideoUrl = localStorage.getItem('videoUrl');

//     if (savedQuiz && savedVideoUrl) {
//       try {
//         const parsedQuiz = JSON.parse(savedQuiz);
//         setQuiz(parsedQuiz);
//         setVideoUrl(savedVideoUrl);
//       } catch (error) {
//         console.error('Error parsing saved quiz from localStorage:', error);
//         // Handle the error, e.g., clear/reset local storage data
//         localStorage.removeItem('quiz');
//         localStorage.removeItem('videoUrl');
//       }
//     }
//   }, []);

//   const handleTranscriptFetch = async () => {
//     try {
//       const response = await fetch('https://video2-quiz-hfa8.vercel.app/transcript', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ videoUrl }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch transcript');
//       }

//       const transcript = await response.text();
//       generateQuiz(transcript);
//     } catch (error) {
//       console.error('Error fetching transcript:', error);
//       setError('Failed to fetch transcript. Please try again.');
//     }
//   };

//   const generateQuiz = async (description) => {
//     setError(null);

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
//             { text: "you will be given a description of the video and you need to return me a JSON object of 5 questions with its options and correct answer that you will generate on basis of the description" },
//           ],
//         },
//         {
//           role: 'model',
//           parts: [
//             { text: "Okay, I'm ready! Please provide me with the description of the video. I will then analyze it and generate 5 multiple-choice questions with options and the correct answer for you." },
//           ],
//         },
//         {
//           role: 'user',
//           parts: [
//             { text: description },
//           ],
//         },
//       ],
//     });

//     try {
//       const result = await chatSession.sendMessage(description);
//       const rawResponse = await result.response.text();

//       console.log('Raw response:', rawResponse); // Log the raw response for debugging

//       // Use regex to find the JSON array in the response
//       const jsonMatch = rawResponse.match(/\[.*\]/s);
//       if (!jsonMatch) {
//         throw new Error('No valid JSON array found in the response');
//       }

//       const cleanResponse = jsonMatch[0];
//       console.log('Cleaned response:', cleanResponse); // Log the cleaned response for debugging

//       const parsedResponse = JSON.parse(cleanResponse); // Parse the cleaned JSON
//       console.log('Parsed JSON:', parsedResponse); // Log the parsed JSON for debugging
//       setQuiz(parsedResponse); // Set the parsed JSON to the state

//       // Save quiz and videoUrl to localStorage
//       localStorage.setItem('quiz', JSON.stringify(parsedResponse));
//       localStorage.setItem('videoUrl', videoUrl);

//     } catch (error) {
//       console.error('Error generating quiz:', error);
//       setError('Failed to generate quiz. Please try again.');
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     handleTranscriptFetch();
//   };

//   const handleDelete = () => {
//     // Clear the quiz and videoUrl from state and localStorage
//     setQuiz(null);
//     setVideoUrl('');
//     localStorage.removeItem('quiz');
//     localStorage.removeItem('videoUrl');
//   };

//   return (
//     <div>
//       <h1>Video Quiz Generator</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={videoUrl}
//           onChange={(e) => setVideoUrl(e.target.value)}
//           placeholder="Enter video URL"
//         />
//         <button type="submit">Fetch Transcript and Generate Quiz</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {quiz && (
//         <div>
//           <h2>Generated Quiz</h2>
//           {quiz.map((q, index) => (
//             <div key={index}>
//               <p><strong>Question {index + 1}:</strong> {q.question}</p>
//               <ul>
//                 {q.options.map((option, i) => (
//                   <li key={i}>{option}</li>
//                 ))}
//               </ul>
//               <p><strong>Correct Answer:</strong> {q.correct_answer}</p>
//             </div>
//           ))}
//           <button onClick={handleDelete}>Clear Quiz</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import axios from 'axios'
const App = () => {
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  const [testResponse, setTestResponse] = useState('');

  const handleTestRequest = async () => {
    try {   
      const response = await axios.get('https://video2-quiz-hfa8.vercel.app/test');
      console.log('Response from server:', response.data);
      setTestResponse(response.data);
    } catch (error) {
      console.error('Error fetching test data:', error);
    }
  };

//    const handleTranscriptFetch = async () => {
// +    console.log('Fetching transcript for video URL:', videoUrl);
//      try {
//        const response = await fetch('https://video2-quiz-hfa8.vercel.app/transcript', {     
//          method: 'POST',
//          headers: {
//            'Content-Type': 'application/json',
//          },
//          body: JSON.stringify({ videoUrl }),
//        });
 
//        if (!response.ok) {
// +        console.error('Error fetching transcript:', response.status);
//          throw new Error('Failed to fetch transcript');
//        }
 
//        const transcript = await response.json();
// +      console.log('Transcript fetched:', transcript);
//        setQuiz(transcript);
//      } catch (error) {
//        console.error('Error fetching transcript:', error);
//        setError('Failed to fetch transcript. Please try again.');
//      }
//    };

const handleTranscriptFetch = async () => {
  console.log('Fetching transcript for video URL:', videoUrl);
  try {
    const response = await axios.post('https://video2-quiz-hfa8.vercel.app/transcript', {
      videoUrl: String(videoUrl)
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status !== 200) {
      console.error('Error fetching transcript:', response.status);
      throw new Error('Failed to fetch transcript');
    }

    const transcript = response.data;
    console.log('Transcript fetched:', transcript);
    setQuiz(transcript); // Assuming setQuiz is defined somewhere in your component
  } catch (error) {
    console.error('Error fetching transcript:', error);
    setError('Failed to fetch transcript. Please try again.'); // Assuming setError is defined somewhere in your component
  }
};

  const handleSubmit = (event) => {
    event.preventDefault();
    handleTranscriptFetch();
  };

  return (
    <div>
  
  <button onClick={handleTestRequest}>Test GET Request</button>
  {testResponse && <p>Response from server: {testResponse}</p>}


      <h1>Video Quiz Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
        />
        <button type="submit">Fetch Transcript and Generate Quiz</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {quiz && (
        <div>
          <h2>Generated Quiz</h2>
          {quiz.map((q, index) => (
            <div key={index}>
              <p><strong>Question {index + 1}:</strong> {q.question}</p>
              <ul>
                {q.options.map((option, i) => (
                  <li key={i}>{option}</li>
                ))}
              </ul>
              <p><strong>Correct Answer:</strong> {q.correct_answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;


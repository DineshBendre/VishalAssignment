import React, { useState } from 'react';
import './App.css';
const { GoogleGenerativeAI } = require("@google/generative-ai");

function App() {
  const [inputText, setInputText] = useState('');
  const [chatGptResponse, setChatGptResponse] = useState('');
  const [geminiAiResponse, setGeminiAiResponse] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator

  const API_KEY_ChatGPT = '';
  const API_KEY_GeminiAI = '';
  const genAI = new GoogleGenerativeAI(API_KEY_GeminiAI);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    if (inputText) {
      try {
        // Request to ChatGPT API
        const responseChatGPT = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY_ChatGPT}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: inputText }],
            temperature: 1.0,
            top_p: 0.7,
            n: 1,
            stream: false,
            presence_penalty: 0,
            frequency_penalty: 0,
          }),
        });

        if (responseChatGPT.ok) {
          const dataChatGPT = await responseChatGPT.json();
          setChatGptResponse(dataChatGPT.choices[0].message.content);
        } else {
          setChatGptResponse('Error: Unable to process your request to ChatGPT API.');
        }

        // Request to Gemini AI API
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const prompt = inputText;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setGeminiAiResponse(text);
        console.log(text);
      } catch (error) {
        console.error(error);
        setChatGptResponse('Error: Unable to process your request.');
        setGeminiAiResponse('Error: Unable to process your request.');
      } finally {
        setLoading(false); // Set loading state to false when response is received
      }
    }
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-screen-xl p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">ChatGPT and Gemini AI API Test</h1>
        <form onSubmit={handleSubmit} id="chat-form" className="mb-6">
          <label htmlFor="mytext" className="block mb-2">Enter your message:</label>
          <input type="text" id="mytext" className="border p-2 w-full mb-2 focus:outline-none focus:border-blue-500 rounded" value={inputText} onChange={(e) => setInputText(e.target.value)} required />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">Submit</button>
        </form>
        <div className="flex justify-between">
          <div className="w-full mr-4">
            <h2 className="text-xl font-bold mb-2">ChatGPT Response:</h2>
            {loading ? ( // Render shimmer effect when loading
              <div className="animate-pulse h-10 w-full bg-gray-200 rounded mb-4"></div>
            ) : (
              <textarea id="response-chatgpt" rows="15" className="border p-2 w-full bg-gray-200 rounded" value={chatGptResponse} readOnly />
            )}
          </div>
          <div className="w-full">
            <h2 className="text-xl font-bold mb-2">Gemini AI Response:</h2>
            {loading ? ( // Render shimmer effect when loading
              <div className="animate-pulse h-10 w-full bg-gray-200 rounded mb-4"></div>
            ) : (
              <textarea id="response-geminiai" rows="15" className="border p-2 w-full bg-gray-200 rounded" value={geminiAiResponse} readOnly />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

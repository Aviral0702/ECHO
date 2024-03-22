import React, { useEffect, useRef, useState } from "react";
import KeyboardVoiceTwoToneIcon from "@mui/icons-material/KeyboardVoiceTwoTone";
import "./App.css";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.lang = "en-IN";
recognition.interimResults = true;
recognition.maxAlternatives = 1;

let finalTranscript = "";

const SpeechComponent = () => {
  const outputRef = useRef(null);
  const notesRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    recognition.onstart = () => {
      setIsSpeaking(true);
    };

    recognition.onend = () => {
      setIsSpeaking(false);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      outputRef.current.textContent = finalTranscript + interimTranscript;
      // notesRef.current.textContent = finalTranscript + interimTranscript;
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.onnomatch = (event) => {
      outputRef.current.textContent = "I didn't recognize that command.";
    };

    recognition.onerror = (event) => {
      outputRef.current.textContent = `Error occurred in recognition: ${event.error}`;
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Transcript</h2>
        <p ref={outputRef} className="output mt-4 text-lg text-gray-700"></p>
      </div>
      <div className="w-1/3 p-4 border-r text-center flex items-center justify-center">
        <div className="flex-col">
          <div className="mb-20">
            <KeyboardVoiceTwoToneIcon
              sx={{ fontSize: 200 }}
              className={isSpeaking ? "glow rounded-full" : ""}
            />
          </div>
          <div>
            <button
              onClick={() => {
                recognition.start();
                console.log("Ready to receive a command.");
              }}
              className="start bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl m-2 h-20 w-48"
            >
              Start
            </button>
            <button
              onClick={() => recognition.stop()}
              className="stop bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl m-2 h-20 w-48"
            >
              Stop
            </button>
          </div>
          <button
            onClick={async () => {
              setIsLoading(true); // start loading
              const response = await fetch(
                "http://localhost:5000/api/question",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    question:
                      "Give Short and sweet Summary of :" + finalTranscript,
                  }),
                }
              );
              const data = await response.json();
              notesRef.current.textContent = data.answer; // render the answer in the notesRef element
              setIsLoading(false); // end loading
            }}
            className="bg-green-500 hover:bg-green-700 text-white text-3xl font-bold py-2 px-4 rounded-xl m-2 h-20 w-96 mt-60"
          >
            Create Notes
          </button>
        </div>
      </div>
      <div className="w-1/3 p-4">
        <h2 className="text-lg font-bold mb-4">Notes</h2>
        <p ref={notesRef} className="notes mt-4 text-lg text-gray-700"></p>
        {isLoading && (
          <div className="flex justify-center items-center h-screen">
            <p className="text-2xl font-bold">Fetching Response...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechComponent;

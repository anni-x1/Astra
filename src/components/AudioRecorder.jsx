import React, { useState, useRef } from "react";

const AudioCapture = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // console.log(stream)
    const mediaRecorder = new MediaRecorder(stream);
    // console.log(mediaRecorder);

    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log(event)
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "2rem auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color:"black"
        }}
      >
        Audio Capture in React
      </h1>
      <button
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          marginRight: "0.5rem",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.2s ease-in-out",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && (
        <div style={{ marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "bold", color:"black" }}>
            Recorded Audio:
          </h2>
          <audio controls src={audioURL} style={{ marginTop: "0.5rem" }}></audio>
        </div>
      )}
    </div>
  );

};

export default AudioCapture;

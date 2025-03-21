import React, { useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import axios from "axios";
import Markdown from "react-markdown";
import "./App.css";

function App() {
  const [code, setCode] = useState(`// Write your code here\n`);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function reviewCode() {
    setIsLoading(true);
    try {
      const response = await axios.post("https://code-reviewer-backend-zeta.vercel.app/ai/get-review", { code });
      setReview(response.data || "No review available");
    } catch (error) {
      console.error("Error fetching review:", error);
      setReview("Failed to fetch review.");
    }
    setIsLoading(false); 
  }

  return (
    <main>
      <div className="left">
        <CodeMirror
          value={code}
          height="100%" 
          width="100%"
          extensions={[javascript()]}
          theme="dark"
          onChange={(value) => setCode(value)}
          basicSetup={{ lineNumbers: true, foldGutter: true }}
          className="cm-editor"
          style={{ flexGrow: 1, overflow:"auto" }}
        />
        <div 
          onClick={!isLoading ? reviewCode : undefined} 
          className={`review ${isLoading ? "loading" : ""}`}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span> Reviewing...
            </>
          ) : "Review"}
        </div>
      </div>

      <div className="right">
        <div className="markdown">
          <Markdown>{review}</Markdown>
        </div>
      </div>
    </main>
  );
}

export default App;

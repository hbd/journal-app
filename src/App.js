import { useState, useEffect } from "react";
import { useCMDEnterPressed } from "./hooks";
import { Editor, EditorState } from "draft-js";

// Styles
import "./styles.css";

const submitPrompt = (input) => {
  fetch("http://localhost:8080/submit", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .then(
      (result) => {
        console.log(`Submit response: ${result}`);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.error(`Error submitting input: ${error}`);
      }
    );
};

export default function App() {
  const cmdReturnPress = useCMDEnterPressed();
  const [promptInput, setPromptInput] = useState("");
  const promptBoxContent = document.getElementById("promptBox");
  const contenteditable = document.querySelector("[contenteditable]");

  useEffect(() => {
    if (cmdReturnPress) {
      console.log(contenteditable.textContent);
    }
  }, [cmdReturnPress]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    alert(`Submitting Name ${promptInput}`);
  };

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  return (
    <div>
      <Editor editorState={editorState} onChange={setEditorState} />
      <div>{cmdReturnPress && "CMD + ENTER"}</div>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div>
        <div id="promptBox" contentEditable="true">
          The following is a conversation with an AI assistant. The assistant
          lives inside the user's journal and helps them think. The assistant is
          helpful, creative, clever, and very friendly.
        </div>
        <div id="promptBox" contentEditable="true">
          Human:
        </div>
      </div>
    </div>
  );
}

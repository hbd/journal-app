import { useState, useEffect } from "react";
import { submitPrompt } from "./api";
import {
  getDefaultKeyBinding,
  KeyBindingUtil,
  Editor,
  EditorState
} from "draft-js";

const EDITOR_CMD_SAVE = "editor-cmd-save";
const EDITOR_CMD_SUBMIT = "editor-cmd-enter";

// Styles
import "./styles.css";

const { hasCommandModifier } = KeyBindingUtil;

function myKeyBindingFn(e: SyntheticKeyboardEvent): string | null {
  let cmd = "";
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    cmd = EDITOR_CMD_SAVE;
  }
  if (e.keyCode === 13 /* `Return` key */ && hasCommandModifier(e)) {
    cmd = EDITOR_CMD_SUBMIT;
  }
  if (cmd !== "") {
    console.debug(`command pressed: ${cmd}`);
    return cmd;
  }
  return getDefaultKeyBinding(e);
}

export default function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  /*
  Returns { blockText, selectedText }
  */
  const getText = () => {
    var selectionState = editorState.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();
    const blockText = currentContentBlock.getText();
    const selectedText = currentContentBlock.getText().slice(start, end);
    const allText = currentContent.getPlainText();
    return { blockText, selectedText, allText };
  };

  const handleKeyCommand = (command: string): DraftHandleValue => {
    if (command === EDITOR_CMD_SAVE) {
      // Perform a request to save your contents, set
      // a new `editorState`, etc.
      return "handled";
    }
    if (command === EDITOR_CMD_SUBMIT) {
      const { blockText, selectedText, allText } = getText();
      console.debug(
        `${blockText}\nselected: '${selectedText}'\nall text: '${allText}'`
      );
      const submittedText = selectedText ? selectedText : allText;
      const resp = submitPrompt(submittedText);
      console.debug(resp);
      return "handled";
    }
    return "not-handled";
  };

  return (
    <div>
      <p>------</p>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={myKeyBindingFn}
      />
      <p>------</p>
    </div>
  );
}

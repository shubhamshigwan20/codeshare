import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") return new jsonWorker();
    if (label === "css" || label === "scss" || label === "less")
      return new cssWorker();
    if (label === "html" || label === "handlebars" || label === "razor")
      return new htmlWorker();
    if (label === "typescript" || label === "javascript") return new tsWorker();
    return new editorWorker();
  },
};

const Editor = ({ textArea, setTextArea, handleTextChange }) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const syncingFromParentRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;
    const current = editorRef.current.getValue();
    if (current === (textArea || "")) return;

    syncingFromParentRef.current = true;
    editorRef.current.setValue(textArea || "");
    syncingFromParentRef.current = false;
  }, [textArea]);

  useEffect(() => {
    if (!containerRef.current) return;

    editorRef.current = monaco.editor.create(containerRef.current, {
      value: textArea || "",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
    });

    const disposeChange = editorRef.current.onDidChangeModelContent(() => {
      if (syncingFromParentRef.current) return;
      const value = editorRef.current.getValue();
      setTextArea(value); // local UI state
      handleTextChange(value); // socket emit + shared state logic
    });

    return () => {
      disposeChange.dispose();
      editorRef.current?.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ height: "80vh", width: "100%" }} />;
};

export default Editor;

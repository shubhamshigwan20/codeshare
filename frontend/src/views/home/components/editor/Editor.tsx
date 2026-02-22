import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

type MonacoEnvironment = {
  getWorker: (_: unknown, label: string) => Worker;
};

(
  self as typeof self & { MonacoEnvironment: MonacoEnvironment }
).MonacoEnvironment = {
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

type EditorProps = {
  textArea: string;
  setTextArea: Dispatch<SetStateAction<string>>;
  handleTextChange: (value: string) => void;
};

const Editor = ({ textArea, setTextArea, handleTextChange }: EditorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const syncingFromParentRef = useRef(false);
  const handleTextChangeRef = useRef(handleTextChange);

  useEffect(() => {
    handleTextChangeRef.current = handleTextChange;
  }, [handleTextChange]);

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
      const value = editorRef.current?.getValue() ?? "";
      setTextArea(value); // local UI state
      handleTextChangeRef.current(value); // always uses latest room-aware handler
    });

    return () => {
      disposeChange.dispose();
      editorRef.current?.dispose();
    };
  }, []);

  return <div ref={containerRef} className="flex-1 min-h-0" />;
};

export default Editor;

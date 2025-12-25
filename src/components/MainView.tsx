import { ExportFileView } from "../pages/UploadFileView.tsx";
import { useState } from "react";
import { readGrisSaveFile } from "../utils/GrisFileReader.ts";
import { useGrisFileContext } from "./fileDisplay/FileDisplayJSONContext.tsx";
import { useRerender } from "../utils/useRerender.ts";
import { FileEditorView } from "../pages/FileEditorView.tsx";

export function MainView() {
  const [appState, setAppState] = useState<"UPLOAD" | "EDIT">("UPLOAD");

  // The react gods frown upon me
  const rerender = useRerender();

  const context = useGrisFileContext();

  function onFileUpload(name: string, file: Uint8Array) {
    try {
      const parsedFile = readGrisSaveFile(file);
      context.setSaveFile(parsedFile, name);
      setAppState("EDIT");

      rerender();
    } catch (e) {
      console.error("Could not read save file", e);
      if (name === "Progress.gs" || name === "Persistent.gs") {
        alert(
          "The file name seems to be correct, but the file could not be read. Feel free to contact me via the contact data on this page.",
        );
      } else {
        alert(
          "That file does not appear to be a gris save file. Please make sure you have the right file. (Could not parse)",
        );
      }
    }
  }

  if (appState === "UPLOAD") {
    return <ExportFileView onFileRead={onFileUpload} />;
  } else if (appState === "EDIT") {
    return <FileEditorView onBackToUpload={() => setAppState("UPLOAD")} />;
  }
}

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ContactMe } from "../components/ContactMe.tsx";
import { NotAssociatedDisclaimer } from "../components/NotAssociatedDisclaimer.tsx";

export function ExportFileView(props: {
  onFileRead: (name: string, fileContent: Uint8Array) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <h1>Upload the Gris save file you want to edit</h1>
      <div style={{ marginBottom: 10 }}>
        Lost your "Cube Friend"? Stuck and can't get out? Something else you
        want to edit?
        <br />
        Edit your gris save file here so you don't have to start over.
        <br />
        <br />
        <b>Always make a backup of your save file first!</b>
        <br />
        The editor allows you to edit freely - including changes that break the
        save file.
        <br />
        <br />
        By the way: If your game glitches out in a certain spot, try lowering
        your screen's refresh rate in the settings.
      </div>
      <div
        style={{
          border: "2px solid #0004",
          borderRadius: 5,
        }}
      >
        <div style={{ padding: 20 }}>
          How to locate your Steam + Windows save file:
          <br />
          <ol>
            <li>Press Win + R on your keyboard.</li>
            <li>
              Enter:{" "}
              <pre>%USERPROFILE%\AppData\LocalLow\nomada studio\GRIS</pre>
              And hit "Enter"
            </li>
            <li>Enter the folder that is a long number.</li>
            <li>Inside, enter the folder "Save01".</li>
            <li>
              Copy the file "Progress.gs" somewhere, like your Desktop, as a
              backup.
            </li>
            <li>
              Drag-and-Drop "Progress.gs" into the file drop area on this page.
            </li>
          </ol>
          <br />
          <i>
            If you installed your game in some other way, Google for the save
            file location. The editor works the same.
          </i>
        </div>
        <DropzonePart onFileRead={props.onFileRead} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          marginTop: 20,
        }}
      >
        <ContactMe />
      </div>
      <div style={{ flexGrow: 1, height: 0 }}></div>
      <NotAssociatedDisclaimer />
    </div>
  );
}

function DropzonePart({
  onFileRead,
}: {
  onFileRead: (name: string, fileContent: Uint8Array) => void;
}) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log("DROPPED", acceptedFiles);

      if (acceptedFiles.length > 1) {
        alert(
          "Multiple files were uploaded. Upload only one file at a time...",
        );
        return;
      }

      const file = acceptedFiles[0];

      const binaryContent = new Uint8Array(await file.arrayBuffer());

      onFileRead(file.name, binaryContent);
    },
    [onFileRead],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/gs": [".gs"],
    },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "3px dashed gray",
        borderRadius: 10,
        padding: "10px 20px",
        display: "flex",
        placeItems: "center",
        backgroundColor: "#fff3",
      }}
    >
      <FaCloudUploadAlt style={{ marginRight: 10, fontSize: "2.5rem" }} />
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}

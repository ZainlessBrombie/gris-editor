import { QuickFixButton } from "../components/QuickFixButton.tsx";
import {
  GrisFileContextAccessor,
  useGrisFileContext,
} from "../components/fileDisplay/FileDisplayJSONContext.tsx";
import { DownloadButton } from "../components/DownloadButton.tsx";
import { writeGrisSaveFile } from "../utils/GrisFileWriter.ts";
import { FileDisplay } from "../components/fileDisplay/FileDisplayJSON.tsx";
import { ContactMe } from "../components/ContactMe.tsx";
import { ControlButtons } from "../components/ControlButtons.tsx";

export function FileEditorView(props: { onBackToUpload: () => void }) {
  const context = useGrisFileContext();

  return (
    <div className={"file-editor-grid"}>
      <div
        style={{
          gridArea: "header",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <h1 style={{ gridArea: "header" }}>Edit your save file</h1>
        <div style={{ flexGrow: 1 }}></div>
        <ContactMe />
      </div>
      <div
        style={{
          gridArea: "sidebar",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div>Go back or reset:</div>
        <ControlButtons onResetEditor={props.onBackToUpload} />
        <div>Download the edited file:</div>
        <DownloadButton
          onClick={() => {
            downloadSaveFile(context);
          }}
        />
        <div>Quick fixes:</div>
        {playerPropertiesFound(context) && (
          <QuickFixButton
            onClick={() => {
              return teleportBlockFriendToPlayer(context);
            }}
            successMessage={
              "Block Friend teleported. Download and replace save file to continue."
            }
          >
            Teleport Block Friend to player
          </QuickFixButton>
        )}
      </div>
      <div
        style={{
          gridArea: "editor",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>File content:</div>
        <div
          style={{
            border: "2px solid #0003",
            overflowY: "scroll",
            marginTop: 7,
            flexGrow: 1,
            flexBasis: 0,
          }}
        >
          <FileDisplay path={[]} isLast={true} topLevel={true} />
        </div>
      </div>
    </div>
  );
}

function playerPropertiesFound(grisSaveFile: GrisFileContextAccessor) {
  const playerX = grisSaveFile.getFileEntryByPath(["PlayerPositionX"])
    ?.value as number;
  const playerY = grisSaveFile.getFileEntryByPath(["PlayerPositionY"])
    ?.value as number;

  return Number.isFinite(playerX + playerY);
}

function teleportBlockFriendToPlayer(
  grisSaveFile: GrisFileContextAccessor,
): string {
  //PlayerPositionX
  //PlayerPositionY
  const playerX = grisSaveFile.getFileEntryByPath(["PlayerPositionX"])
    ?.value as number;
  const playerY = grisSaveFile.getFileEntryByPath(["PlayerPositionY"])
    ?.value as number;

  if (!Number.isFinite(playerX + playerY)) {
    return "Could not find player coordinates";
  }

  const kodamaX = grisSaveFile.getFileEntryByPath([
    "Forest",
    "-923695957",
    "Kodama_Position_X",
  ]);
  const kodamaY = grisSaveFile.getFileEntryByPath([
    "Forest",
    "-923695957",
    "Kodama_Position_Y",
  ]);

  if (!kodamaX || !kodamaY) {
    return "Could not find the position of Kodama. Please let me know about this. You can still teleport him manually, just look for Kodama_Position_X and Kodama_Position";
  }

  if (kodamaX.type !== "double" || kodamaY.type !== "double") {
    return "Kodama coordinates are not numbers. Something changed about the format.";
  }

  kodamaX.value = playerX;
  kodamaY.value = playerY + 3;

  grisSaveFile.notifyAll();

  return "";
}

function downloadSaveFile(grisSaveFile: GrisFileContextAccessor) {
  const editedSaveFile = writeGrisSaveFile(grisSaveFile.getSaveFile()!);
  // @ts-expect-error TODO why does it not recognize this as a buffer source?
  const blob = new Blob([editedSaveFile], {
    type: "application/octet-stream",
  });
  const url = window.URL.createObjectURL(blob);

  downloadUrl(url, grisSaveFile.getFileName());

  setTimeout(function () {
    return window.URL.revokeObjectURL(url);
  }, 1000);
}

function downloadUrl(url: string, fileName: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.style = "display: none";
  a.click();
  a.remove();
}

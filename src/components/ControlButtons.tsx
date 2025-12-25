import { FaArrowLeft } from "react-icons/fa6";
import type { PropsWithChildren } from "react";
import { RiResetLeftFill } from "react-icons/ri";
import { useGrisFileContext } from "./fileDisplay/FileDisplayJSONContext.tsx";

export function ControlButtons(props: { onResetEditor: () => void }) {
  const fileContext = useGrisFileContext();

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <BoringButton
        onClick={() => {
          props.onResetEditor();
        }}
      >
        <FaArrowLeft style={{ fontSize: "1.4em" }} />
        Back to upload
      </BoringButton>
      <BoringButton
        onClick={() => {
          fileContext.undoAll();
        }}
      >
        <RiResetLeftFill style={{ fontSize: "1.4em" }} />
        Reset all changes
      </BoringButton>
    </div>
  );
}

function BoringButton(props: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button className={"boring-button"} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

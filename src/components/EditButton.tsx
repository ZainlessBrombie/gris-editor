import { MdEdit } from "react-icons/md";
import { CONTROL_COLOR } from "./fileDisplay/FileDisplayJSON.tsx";

export function EditButton(props: { onClick: () => void }) {
  return (
    <MdEdit
      style={{
        color: CONTROL_COLOR,
        cursor: "pointer",
        verticalAlign: "middle",
        position: "relative",
        bottom: "2px",
      }}
      onClick={props.onClick}
    />
  );
}

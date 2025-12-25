import { FaCheck } from "react-icons/fa";

import { STRING_COLOR } from "./fileDisplay/FileDisplayJSON.tsx";

export function CheckIconButton(props: { onClick: () => void }) {
  return (
    <FaCheck
      style={{
        color: STRING_COLOR,
        cursor: "pointer",
        verticalAlign: "middle",
        position: "relative",
        bottom: "2px",
      }}
      onClick={props.onClick}
    />
  );
}

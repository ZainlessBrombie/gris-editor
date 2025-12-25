import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { CONTROL_COLOR } from "./fileDisplay/FileDisplayJSON.tsx";

export function CollapseExpandButton(props: {
  expanded: boolean;
  onClick: () => void;
}) {
  if (props.expanded) {
    return (
      <CiCircleMinus
        onClick={props.onClick}
        style={{
          color: CONTROL_COLOR,
          cursor: "pointer",
          verticalAlign: "middle",
        }}
      />
    );
  } else {
    return (
      <CiCirclePlus
        onClick={props.onClick}
        style={{
          color: CONTROL_COLOR,
          cursor: "pointer",
          verticalAlign: "middle",
        }}
      />
    );
  }
}

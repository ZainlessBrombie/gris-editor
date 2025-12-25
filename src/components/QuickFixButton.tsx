import { Fragment, type PropsWithChildren, useState } from "react";

export function QuickFixButton(
  props: PropsWithChildren<{
    onClick: () => string | undefined;
    successMessage: string;
  }>,
) {
  const [errorText, setErrorText] = useState("");
  const [attempted, setAttempted] = useState(false);

  return (
    <Fragment>
      <button
        className={`quick-fix-button ${errorText ? "error" : ""}`}
        onClick={() => {
          setErrorText(props.onClick() ?? "");
          setAttempted(true);
        }}
      >
        {props.children}
      </button>
      <div
        style={{
          color: "red",
          fontSize: "0.7rem",
          padding: 5,
          display: errorText ? "unset" : "none",
        }}
      >
        {errorText}
      </div>
      <div
        style={{
          color: "green",
          fontSize: "0.7rem",
          padding: 5,
          display: attempted && !errorText ? "unset" : "none",
        }}
      >
        {props.successMessage}
      </div>
    </Fragment>
  );
}

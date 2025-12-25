import { Fragment } from "react";
import GithubIcon from "./GithubIcon.tsx";
import { DiscordIcon } from "./DiscordIcon.tsx";

export function ContactMe() {
  return (
    <Fragment>
      <a
        href={"https://github.com/ZainlessBrombie/gris-editor/issues"}
        target="_blank"
        rel="noopener noreferrer"
      >
        Report a bug:
      </a>
      <a
        style={{ height: "fit-content", marginRight: 20 }}
        href={"https://github.com/ZainlessBrombie/gris-editor/issues"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubIcon
          style={{ height: "2rem", width: "2rem", display: "block" }}
        />
      </a>
      <div>
        <div>Text me on Discord:</div>
        <div style={{ display: "flex" }}>
          <DiscordIcon
            style={{
              height: "1.1em",
              width: "1.1em",
              display: "block",
              marginRight: 4,
              marginLeft: 6,
            }}
          />
          #zainlessbrombie
        </div>
      </div>
    </Fragment>
  );
}

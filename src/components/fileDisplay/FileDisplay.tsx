import type { GrisFileEntry } from "../../utils/GrisFile.types.ts";
import { Fragment, useState } from "react";

export function FileDisplay(props: {
  entry: GrisFileEntry;
  path: string[];
  topLevel?: boolean;
}) {
  switch (props.entry.type) {
    case "double":
      return <DoubleEntry value={props.entry.value} path={props.path} />;
    case "boolean":
      return <BooleanEntry value={props.entry.value} path={props.path} />;
    case "string":
      return <StringEntry value={props.entry.value} path={props.path} />;
    case "object":
      return (
        <ObjectEntry
          value={props.entry.value}
          path={props.path}
          topLevel={props.topLevel}
        />
      );
    case "array":
      return <ArrayEntry values={props.entry.value} path={props.path} />;
  }
}

function ObjectEntry(props: {
  value: Record<string, GrisFileEntry>;
  path: string[];
  topLevel?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(!props.topLevel);

  return (
    <div
      style={{
        border: "2px solid white",
        display: "flex",
        flexDirection: "column",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 6,
      }}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          cursor: "pointer",
          display: props.topLevel ? "none" : undefined,
        }}
      >
        <pre style={{ margin: 0 }}>{collapsed ? "[Expand]" : "[Collapse]"}</pre>
      </div>

      <div
        style={{
          maxHeight: collapsed ? "30px" : "none",
          opacity: collapsed ? 0.2 : 1,
          overflow: "hidden",
        }}
      >
        {Object.entries(props.value).map(([key, value], index) => {
          return (
            <Fragment key={key}>
              <div style={{ marginTop: index === 0 ? 0 : "10px" }}>{key}:</div>
              <div
                style={{
                  paddingLeft: "10px",
                  marginTop: "10px",
                }}
              >
                <FileDisplay entry={value} path={[...props.path, key]} />
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function ArrayEntry(props: { values: GrisFileEntry[]; path: string[] }) {
  return (
    <div
      style={{
        border: "2px solid white",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      {props.values.map((entry, index) => (
        <div>
          {/* There isn't really any "key" one could use - for now. */}
          <FileDisplay
            key={index}
            entry={entry}
            path={[...props.path, index.toString()]}
          />
        </div>
      ))}
    </div>
  );
}

function StringEntry(props: { value: string; path: string[] }) {
  return <span>{props.value}</span>;
}

function BooleanEntry(props: { value: boolean; path: string[] }) {
  return <span>{props.value}</span>;
}

function DoubleEntry(props: { value: number; path: string[] }) {
  return <span>{props.value}</span>;
}

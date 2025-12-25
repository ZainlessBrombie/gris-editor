import type { GrisFileEntry } from "../../utils/GrisFile.types.ts";
import { EditButton } from "../EditButton.tsx";
import { CollapseExpandButton } from "../CollapseExpandButton.tsx";
import { Fragment, useEffect, useRef, useState } from "react";
import { CheckIconButton } from "../CheckIconButton.tsx";
import {
  useGrisFileContext,
  useGrisFileValueString,
  useGrisOriginalFileValueString,
} from "./FileDisplayJSONContext.tsx";

export const jsonIndent = "1rem";
export const STRING_COLOR = "#69AA72FF";
export const BOOLEAN_COLOR = "#CF8E6C";
export const DOUBLE_COLOR = "#2AACB8";
export const CONTROL_COLOR = "#BABABA";

export function FileDisplay(props: {
  jsonKey?: string;
  isLast: boolean;
  path: string[];
  topLevel?: boolean;
}) {
  const grisContext = useGrisFileContext();
  const entry = grisContext.getFileEntryByPath(props.path);
  if (!entry) {
    return <>MISSING FILE ENTRY</>;
  }

  switch (entry.type) {
    case "double":
      return (
        <DoubleEntry
          path={props.path}
          jsonKey={props.jsonKey}
          isLast={props.isLast}
        />
      );
    case "boolean":
      return (
        <BooleanEntry
          value={entry.value}
          path={props.path}
          jsonKey={props.jsonKey}
          isLast={props.isLast}
        />
      );
    case "string":
      return (
        <StringEntry
          path={props.path}
          jsonKey={props.jsonKey}
          isLast={props.isLast}
        />
      );
    case "object":
      return (
        <ObjectEntry
          value={entry.value}
          path={props.path}
          jsonKey={props.jsonKey}
          isLast={props.isLast}
        />
      );
    case "array":
      return (
        <ArrayEntry
          values={entry.value}
          path={props.path}
          jsonKey={props.jsonKey}
          isLast={props.isLast}
        />
      );
  }
}

function ObjectEntry({
  jsonKey,
  value,
  isLast,
  path,
}: {
  jsonKey?: string;
  isLast: boolean;
  value: Map<string, GrisFileEntry>;
  path: string[];
}) {
  const [expanded, setExpanded] = useState(true);

  const entries = [...value.entries()];
  return (
    <>
      <JsonKeyPrefix jsonKey={jsonKey} />
      <span style={{ fontFamily: "monospace", color: CONTROL_COLOR }}>
        {"{"}
      </span>
      {entries.length > 1 && (
        <CollapseExpandButton
          expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        />
      )}
      <div
        style={{
          paddingLeft: jsonIndent,
        }}
      >
        <span
          style={{
            color: CONTROL_COLOR,
            opacity: 0.4,
            display: expanded ? "none" : undefined,
            height: "0px",
          }}
        >
          ...
        </span>
        {expanded &&
          entries.map(([key], index) => {
            return (
              <div>
                <FileDisplay
                  key={key}
                  path={[...path, key]}
                  jsonKey={key}
                  isLast={index === entries.length - 1}
                />
              </div>
            );
          })}
      </div>
      <div style={{ fontFamily: "monospace", color: CONTROL_COLOR }}>
        {"}"}
        {isLast ? undefined : ","}
      </div>
    </>
  );
}

function ArrayEntry({
  jsonKey,
  values,
  path,
  isLast,
}: {
  jsonKey?: string;
  isLast: boolean;
  values: GrisFileEntry[];
  path: string[];
}) {
  return (
    <>
      <JsonKeyPrefix jsonKey={jsonKey} />
      <span style={{ fontFamily: "monospace", color: CONTROL_COLOR }}>
        {"["}
      </span>
      <div style={{ paddingLeft: jsonIndent }}>
        {values.map((_, index) => {
          return (
            <div>
              <FileDisplay
                path={[...path, index.toString()]}
                isLast={index === values.length - 1}
              />
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: "monospace", color: CONTROL_COLOR }}>
        {"]"}
        {isLast ? undefined : ","}
      </div>
    </>
  );
}

function StringEntry({
  jsonKey,
  isLast,
  path,
}: {
  jsonKey?: string;
  isLast: boolean;
  path: string[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLSpanElement | null>(null);

  const grisContext = useGrisFileContext();
  const valueInConfigFile = useGrisFileValueString(path);
  const originalValue = useGrisOriginalFileValueString(path);

  useEffect(() => {
    contentRef.current!.innerText = valueInConfigFile;
  }, [valueInConfigFile]);

  useEffect(() => {
    if (isEditing) {
      contentRef.current!.focus();
      selectionToEnd(contentRef.current!);
    }
  }, [isEditing]);

  function onConfirmValue() {
    setIsEditing(false);

    grisContext.setStringValueByPath(path, contentRef.current!.innerText);
  }

  return (
    <div style={{ display: "flex" }}>
      <JsonKeyPrefix jsonKey={jsonKey} />
      <span
        style={{
          fontFamily: "monospace",
          color: STRING_COLOR,
          display: isEditing ? "none" : "unset",
        }}
      >
        {JSON.stringify(valueInConfigFile)}
      </span>
      <div
        style={{
          fontFamily: "monospace",
          display: isEditing ? "unset" : "none",
        }}
      >
        <span style={{ color: STRING_COLOR }}>"</span>
        <span
          className={"editable-span"}
          style={{ padding: 3, fontFamily: "monospace" }}
          contentEditable={isEditing}
          ref={contentRef}
          onBlur={onConfirmValue}
          onKeyDown={(evt) => {
            // Currently prevents new lines from being inserted but oh well, doubt anyone will need that
            if (evt.code === "Enter") {
              evt.preventDefault();
              onConfirmValue();
            }
          }}
        ></span>
        <span style={{ color: STRING_COLOR }}>"</span>
      </div>
      <span style={{ fontFamily: "monospace" }}>
        {isLast ? undefined : ","}
      </span>
      {!isEditing && (
        <EditButton
          onClick={() => {
            setIsEditing(true);
          }}
        />
      )}
      {isEditing && <CheckIconButton onClick={onConfirmValue} />}
      <span
        style={{
          marginLeft: "0.5rem",
          opacity: 0.3,
          fontStyle: "italic",
          display: originalValue !== valueInConfigFile ? "unset" : "none",
          whiteSpace: "nowrap",
        }}
      >
        Was: {JSON.stringify(originalValue)}
      </span>
    </div>
  );
}

function BooleanEntry({
  jsonKey,
  isLast,
  path,
}: {
  jsonKey?: string;
  isLast: boolean;
  value: boolean;
  path: string[];
}) {
  const grisContext = useGrisFileContext();
  const valueInConfigFile = useGrisFileValueString(path);
  const originalValue = useGrisOriginalFileValueString(path);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <JsonKeyPrefix jsonKey={jsonKey} />
      <span
        style={{
          fontFamily: "monospace",
          color: BOOLEAN_COLOR,
          position: "relative",
        }}
      >
        {`${valueInConfigFile}`}
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "-50%", // TODO
            backgroundColor: "#505050",
            borderRadius: 5,
            padding: 5,
            width: "max-content",
            border: "2px solid #333",
            display: isEditing ? "unset" : "none",
            zIndex: 100,
          }}
        >
          <div
            onClick={() => {
              grisContext.setBooleanValueByPath(path, true);
              setIsEditing(false);
            }}
            style={{
              cursor: "pointer",
              fontWeight: valueInConfigFile === "true" ? "bold" : "unset",
            }}
          >
            • true
          </div>
          <div
            onClick={() => {
              grisContext.setBooleanValueByPath(path, false);
              setIsEditing(false);
            }}
            style={{
              marginTop: 4,
              cursor: "pointer",
              fontWeight: valueInConfigFile === "false" ? "bold" : "unset",
            }}
          >
            • false
          </div>
        </span>
      </span>
      <span style={{ fontFamily: "monospace" }}>
        {isLast ? undefined : ","}&nbsp;
      </span>
      {!isEditing && (
        <EditButton
          onClick={() => {
            setIsEditing(true);
          }}
        />
      )}
      <span
        style={{
          marginLeft: "0.5rem",
          opacity: 0.3,
          fontStyle: "italic",
          display: originalValue !== valueInConfigFile ? "unset" : "none",
        }}
      >
        Was: {originalValue}
      </span>
    </>
  );
}

function DoubleEntry({
  jsonKey,
  isLast,
  path,
}: {
  jsonKey?: string;
  isLast: boolean;
  path: string[];
}) {
  const [isEditing, setIsEditing] = useState(false);

  const grisContext = useGrisFileContext();
  const valueInConfigFile = useGrisFileValueString(path);

  const originalValue = useGrisOriginalFileValueString(path);

  const contentRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    contentRef.current!.innerText = valueInConfigFile;
  }, [valueInConfigFile]);

  function onConfirmValue() {
    setIsEditing(false);
    const newNumber = Number.parseFloat(contentRef.current!.innerText);

    if (Number.isFinite(newNumber)) {
      grisContext.setDoubleValueByPath(path, newNumber);
      contentRef.current!.innerText = newNumber.toString();
    } else {
      contentRef.current!.innerText = valueInConfigFile;
    }
  }

  return (
    <>
      <JsonKeyPrefix jsonKey={jsonKey} />
      <span
        className={"editable-span"}
        style={{ fontFamily: "monospace", color: DOUBLE_COLOR }}
        contentEditable={isEditing}
        onKeyDown={(evt) => {
          if (evt.code === "Enter") {
            evt.preventDefault();
            onConfirmValue();
          }
        }}
        ref={contentRef}
        onBlur={onConfirmValue}
      ></span>
      <span style={{ fontFamily: "monospace" }}>
        {isLast ? undefined : ","}&nbsp;
      </span>
      {!isEditing && (
        <EditButton
          onClick={() => {
            setIsEditing(true);
            // Lazy hack
            contentRef.current!.contentEditable = "true";
            contentRef.current?.focus();
            selectionToEnd(contentRef.current!);
          }}
        />
      )}
      {isEditing && <CheckIconButton onClick={onConfirmValue} />}
      <span
        style={{
          marginLeft: "0.5rem",
          opacity: 0.3,
          fontStyle: "italic",
          display: originalValue !== valueInConfigFile ? "unset" : "none",
        }}
      >
        Was: {originalValue}
      </span>
    </>
  );
}

function JsonKeyPrefix(props: { jsonKey?: string }) {
  if (typeof props.jsonKey !== "string") {
    return <></>;
  }
  return (
    <Fragment>
      <span
        style={{
          color: STRING_COLOR,
          fontFamily: "monospace",
        }}
      >
        {JSON.stringify(props.jsonKey)}
      </span>
      <span style={{ fontFamily: "monospace" }}>: </span>
    </Fragment>
  );
}

function selectionToEnd(element: HTMLElement) {
  console.log({ element });
  const range = document.createRange();
  const selection = window.getSelection();

  if (!element.childNodes[0]) {
    element.appendChild(document.createTextNode(""));
  }

  range.setStart(element.childNodes[0], element.innerText.toString().length);
  range.collapse(true);

  selection?.removeAllRanges();
  selection?.addRange(range);
}

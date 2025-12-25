import { Fragment, useState } from "react";
import { createPortal } from "react-dom";
import {
  useGrisFileContext,
  useGrisFileValueString,
} from "./fileDisplay/FileDisplayJSONContext.tsx";

export function EditPlayerCoordinatesModal(props: { onClose: () => void }) {
  const fileContext = useGrisFileContext();
  const playerX = useGrisFileValueString(["PlayerPositionX"]);
  const playerY = useGrisFileValueString(["PlayerPositionY"]);

  const [newPlayerX, setNewPlayerX] = useState(playerX);
  const [newPlayerY, setNewPlayerY] = useState(playerY);

  const parsedPlayerX = Number(newPlayerX);
  const parsedPlayerY = Number(newPlayerY);

  const canConfirm = Number.isFinite(parsedPlayerX + parsedPlayerY);

  function onClickConfirm() {
    fileContext.setDoubleValueByPath(["PlayerPositionX"], parsedPlayerX);
    fileContext.setDoubleValueByPath(["PlayerPositionY"], parsedPlayerY);
    props.onClose();
  }

  return (
    <Fragment>
      {createPortal(
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            backgroundColor: "#0008",
            display: "flex",
            justifyContent: "center",
            placeItems: "center",
            zIndex: 110,
          }}
        >
          <div
            style={{
              backgroundColor: "#3a3a3a",
              height: "fit-content",
              padding: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <b style={{ fontSize: "1.4em", display: "block" }}>
              Edit player coordinates:
            </b>

            <div style={{ marginTop: 15 }}>Player X (Left to Right):</div>
            <input
              value={newPlayerX}
              onChange={(evt) => setNewPlayerX(evt.target.value)}
              style={{ display: "block" }}
            />

            <div style={{ marginTop: 15 }}>Player Y (Bottom to Top):</div>
            <input
              value={newPlayerY}
              onChange={(evt) => setNewPlayerY(evt.target.value)}
              style={{ display: "block", marginTop: 5 }}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className={"cancel-button"} onClick={props.onClose}>
                Cancel
              </button>
              <button
                className={"confirm-button"}
                disabled={!canConfirm}
                onClick={onClickConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>,
        document.getElementById("modalContainer")!,
      )}
    </Fragment>
  );
}

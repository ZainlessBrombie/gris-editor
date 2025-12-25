import { FaFileDownload } from "react-icons/fa";

export function DownloadButton(props: { onClick: () => void }) {
  return (
    <button className={"download-button"} onClick={props.onClick}>
      <FaFileDownload style={{ fontSize: "1.4em" }} />
      Download save file
    </button>
  );
}

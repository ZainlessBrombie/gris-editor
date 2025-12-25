import "./App.css";
import { FileDisplay } from "./components/fileDisplay/FileDisplayJSON.tsx";
import {
  parsedPersistentFile,
  parsedProgressFile,
} from "./utils/TempStaticGrisFile.ts";
import { GrisFileContext } from "./components/fileDisplay/FileDisplayJSONContext.tsx";

function App() {
  // TODO check file read/write consistency each time

  return (
    <GrisFileContext>
      <FileDisplay path={[]} topLevel={true} isLast={true} />
    </GrisFileContext>
  );
}

export default App;

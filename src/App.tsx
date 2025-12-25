import "./App.css";
import { GrisFileContext } from "./components/fileDisplay/FileDisplayJSONContext.tsx";
import { MainView } from "./components/MainView.tsx";

function App() {
  // TODO check file read/write consistency each time

  return (
    <GrisFileContext>
      <MainView />
    </GrisFileContext>
  );
}

export default App;

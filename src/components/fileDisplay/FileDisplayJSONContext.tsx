import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { GrisFileEntry } from "../../utils/GrisFile.types.ts";
import { useRerender } from "../../utils/useRerender.ts";

const ReactGrisFileContext = createContext<GrisFileContextAccessor | null>(
  null,
);

export class GrisFileContextAccessor {
  private saveFile?: GrisFileEntry;
  private uneditedSaveFile?: GrisFileEntry;
  private fileName: string = "Progress.gs";
  private listeners: Set<() => void> = new Set<() => void>();

  constructor() {}

  setSaveFile(saveFile: GrisFileEntry, fileName: string) {
    this.saveFile = saveFile;
    this.uneditedSaveFile = cloneGrisFile(this.saveFile);
    this.fileName = fileName;
  }

  getSaveFile(): GrisFileEntry | undefined {
    return this.saveFile;
  }

  getFileName(): string {
    return this.fileName;
  }

  getUneditedSaveFile(): GrisFileEntry | undefined {
    return this.uneditedSaveFile;
  }

  getFileEntryByPath(path: string[]): GrisFileEntry | undefined {
    return getGrisFileEntryByPathFromFile(this.saveFile, path);
  }

  getOriginalFileEntryByPath(path: string[]): GrisFileEntry | undefined {
    return getGrisFileEntryByPathFromFile(this.uneditedSaveFile, path);
  }

  setStringValueByPath(path: string[], value: string) {
    const entry = this.getFileEntryByPath(path);
    if (entry?.type === "string") {
      entry.value = value;
      this.notifyAll();
    } else {
      alert("Editor error: String expected but not found at " + path.join("."));
    }
  }

  setDoubleValueByPath(path: string[], value: number) {
    const entry = this.getFileEntryByPath(path);
    if (entry?.type === "double") {
      entry.value = value;
      this.notifyAll();
    } else {
      alert("Editor error: Double expected but not found at " + path.join("."));
    }
  }

  setBooleanValueByPath(path: string[], value: boolean) {
    const entry = this.getFileEntryByPath(path);
    if (entry?.type === "boolean") {
      entry.value = value;
      this.notifyAll();
    } else {
      alert(
        "Editor error: Boolean expected but not found at " + path.join("."),
      );
    }
  }

  addChangeListener(listener: () => void) {
    this.listeners.add(listener);
  }

  removeChangeListener(listener: () => void) {
    this.listeners.delete(listener);
  }

  notifyAll() {
    [...this.listeners].forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error(e);
      }
    });
  }
}

function getGrisFileEntryByPathFromFile(
  file: GrisFileEntry | undefined,
  path: string[],
): GrisFileEntry | undefined {
  let current = file;

  for (const pathElement of path) {
    if (!current) {
      return undefined;
    }

    if (current.type === "object") {
      current = current.value.get(pathElement);
    } else if (current.type === "array") {
      current = current.value[parseInt(pathElement)];
    } else {
      current = undefined;
    }
  }

  return current;
}

export function GrisFileContext(props: PropsWithChildren) {
  const [context] = useState(new GrisFileContextAccessor());

  return (
    <ReactGrisFileContext.Provider value={context}>
      {props.children}
    </ReactGrisFileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGrisFileContext(): GrisFileContextAccessor {
  const contextValue = useContext(ReactGrisFileContext);
  if (!contextValue) {
    throw new Error("Missing ReactGrisFileContext");
  }

  return contextValue;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGrisFileValueString(path: string[]): string {
  const context = useGrisFileContext();
  const rerender = useRerender();

  useEffect(() => {
    let oldValue =
      context.getFileEntryByPath(path)?.value.toString() ?? "<<EDITOR-ERROR>>";
    const listener = () => {
      const newValue =
        context.getFileEntryByPath(path)?.value.toString() ??
        "<<EDITOR-ERROR>>";
      if (newValue !== oldValue) {
        oldValue = newValue;
        rerender();
      }
    };

    context.addChangeListener(listener);

    return () => context.removeChangeListener(listener);
  }, [context, path, rerender]);

  return (
    context.getFileEntryByPath(path)?.value.toString() ?? "<<EDITOR-ERROR>>"
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGrisOriginalFileValueString(path: string[]): string {
  const context = useGrisFileContext();

  const uneditedSaveFile = context.getUneditedSaveFile();
  const originalValue = useMemo(
    () => getGrisFileEntryByPathFromFile(uneditedSaveFile, path),
    [uneditedSaveFile, path],
  );

  return originalValue?.value.toString() ?? "<<EDITOR-ERROR>>";
}

function cloneGrisFile(file: GrisFileEntry): GrisFileEntry {
  switch (file.type) {
    case "double":
      return {
        type: "double",
        value: file.value,
      };
    case "boolean":
      return {
        type: "boolean",
        value: file.value,
      };
    case "string":
      return {
        type: "string",
        value: file.value,
      };
    case "object":
      return {
        type: "object",
        value: new Map(
          [...file.value.entries()].map(([k, v]) => [k, cloneGrisFile(v)]),
        ),
      };
    case "array":
      return {
        type: "array",
        value: file.value.map((v) => cloneGrisFile(v)),
      };
  }
}

import type { GrisFileEntry } from "./GrisFile.types.ts";

export function readGrisSaveFile(content: Uint8Array): GrisFileEntry {
  const saveFile = new RawGrisSaveFile(content);

  return readEntry(saveFile);
}

class RawGrisSaveFile {
  private current: number = 0;
  private content: Uint8Array;

  constructor(content: Uint8Array) {
    this.content = content;
  }

  popOne(): number {
    const ret = this.content[this.current];
    this.current += 1;
    return ret;
  }

  popMany(count: number): Uint8Array {
    const ret = this.content.subarray(this.current, this.current + count);
    this.current += count;
    return ret;
  }

  getPosition(): number {
    return this.current;
  }
}

function readEntry(saveFile: RawGrisSaveFile): GrisFileEntry {
  const typeToRead = saveFile.popOne();

  switch (typeToRead) {
    case 0x01:
      return { type: "array", value: readArray(saveFile) };
    case 0x02:
      return { type: "object", value: readObject(saveFile) };
    case 0x03:
      return { type: "string", value: readString(saveFile) };
    case 0x04:
      return { type: "double", value: readDouble(saveFile) };
    case 0x06:
      return { type: "boolean", value: readBoolean(saveFile) };
    default:
      throw new Error(
        `Unknown type, cannot read: ${typeToRead} at position ${saveFile.getPosition()}`,
      );
  }
}

function readObject(saveFile: RawGrisSaveFile): Map<string, GrisFileEntry> {
  const count = readIntegerLittleEndian(saveFile);
  const entries: Map<string, GrisFileEntry> = new Map<string, GrisFileEntry>();

  for (let i = 0; i < count; i++) {
    const key = readString(saveFile);
    entries.set(key, readEntry(saveFile));
  }

  return entries;
}

function readArray(saveFile: RawGrisSaveFile): GrisFileEntry[] {
  const length = readIntegerLittleEndian(saveFile);
  const entries: GrisFileEntry[] = [];

  for (let i = 0; i < length; i++) {
    entries.push(readEntry(saveFile));
  }

  return entries;
}

function readString(saveFile: RawGrisSaveFile): string {
  const length = saveFile.popOne();
  const content = saveFile.popMany(length);
  return new TextDecoder("utf-8").decode(content);
}

function readIntegerLittleEndian(saveFile: RawGrisSaveFile): number {
  const bytes = saveFile.popMany(4);
  return new DataView(bytes.buffer, bytes.byteOffset, 4).getUint32(0, true);
}

function readDouble(saveFile: RawGrisSaveFile): number {
  const bytes = saveFile.popMany(8);
  return new DataView(bytes.buffer, bytes.byteOffset, 8).getFloat64(0, true);
}

function readBoolean(saveFile: RawGrisSaveFile): boolean {
  return saveFile.popOne() === 1;
}

function __stripType(entry: GrisFileEntry): unknown {
  switch (entry.type) {
    case "double":
    case "boolean":
    case "string":
      return entry.value;
    case "array":
      return entry.value.map(__stripType);
    case "object": {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(entry.value)) {
        result[key] = __stripType(value);
      }
      return result;
    }
  }
}

export function __parseGrisSaveFile(content: Uint8Array): unknown {
  const saveFile = new RawGrisSaveFile(content);
  const entry = readEntry(saveFile);
  return __stripType(entry);
}

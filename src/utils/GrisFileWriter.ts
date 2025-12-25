import type { GrisFileEntry } from "./GrisFile.types.ts";

export function writeGrisSaveFile(file: GrisFileEntry): Uint8Array {
  const writer = new ByteWriter();

  writeEntry(writer, file);

  return writer.toUint8Array();
}

class ByteWriter {
  private chunks: Uint8Array[] = [];

  pushOne(byte: number): void {
    this.chunks.push(new Uint8Array([byte]));
  }

  pushMany(bytes: Uint8Array): void {
    this.chunks.push(bytes);
  }

  toUint8Array(): Uint8Array {
    const totalLength = this.chunks.reduce(
      (sum, chunk) => sum + chunk.length,
      0,
    );
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of this.chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }
}

function writeEntry(writer: ByteWriter, entry: GrisFileEntry): void {
  switch (entry.type) {
    case "array":
      writer.pushOne(0x01);
      writeArray(writer, entry.value);
      break;
    case "object":
      writer.pushOne(0x02);
      writeObject(writer, entry.value);
      break;
    case "string":
      writer.pushOne(0x03);
      writeString(writer, entry.value);
      break;
    case "double":
      writer.pushOne(0x04);
      writeDouble(writer, entry.value);
      break;
    case "boolean":
      writer.pushOne(0x06);
      writeBoolean(writer, entry.value);
      break;
  }
}

function writeObject(
  writer: ByteWriter,
  obj: Map<string, GrisFileEntry>,
): void {
  const entries = [...obj.entries()];
  writeIntegerLittleEndian(writer, entries.length);
  for (const [key, value] of entries) {
    writeString(writer, key);
    writeEntry(writer, value);
  }
}

function writeArray(writer: ByteWriter, arr: GrisFileEntry[]): void {
  writeIntegerLittleEndian(writer, arr.length);
  for (const entry of arr) {
    writeEntry(writer, entry);
  }
}

function writeString(writer: ByteWriter, str: string): void {
  const encoded = new TextEncoder().encode(str);
  writer.pushOne(encoded.length);
  writer.pushMany(encoded);
}

function writeIntegerLittleEndian(writer: ByteWriter, value: number): void {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value, true);
  writer.pushMany(bytes);
}

function writeDouble(writer: ByteWriter, value: number): void {
  const bytes = new Uint8Array(8);
  new DataView(bytes.buffer).setFloat64(0, value, true);
  writer.pushMany(bytes);
}

function writeBoolean(writer: ByteWriter, value: boolean): void {
  writer.pushOne(value ? 1 : 0);
}

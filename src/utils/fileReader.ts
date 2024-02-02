import fs from "fs";

type CallBack = (
  err: NodeJS.ErrnoException | null,
  data: string | null
) => void;

function readFileContents(filePath: string, callback: CallBack) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }

    callback(null, data);
  });
}

export function getFileAsString(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFileContents(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data!);
    });
  });
}

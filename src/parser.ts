import { getFileAsString } from "./utils/fileReader";

type JsonObj = {
  [key: string]: string;
};

export const extract = async (filePath: string) => {
  let result = [];
  let str = await getFileAsString(filePath);
  result = parse(str, []);
  return result;
};

export const extractFromLink = async (link: string) => {
  const res: Response = await fetch(link);
  const response = await res.json();
  const content = await response.content;
  const binary = Buffer.from(content);
  const result = parse(binary.toString(), []);

  return result;
};

function parse(rawData: string, res: JsonObj[]) {
  const result = [];

  const trimmed = rawData.trim();
  const eachRow = trimmed.split("\n");

  const headerParser = (row: string) => {
    return row
      .split("|")
      .map((r) => r.trim())
      .filter((r) => r !== "");
  };

  const headers = headerParser(eachRow[0]);

  const theRest = eachRow.slice(2, eachRow.length);

  const linkFlag = ["https://", "http://"];

  for (let eachCol of theRest) {
    let current_parsed = headerParser(eachCol);
    let currentObj: JsonObj = {};

    let counter = 0;

    for (let eachVal of current_parsed) {
      let currentKey = headers[counter];

      if (eachVal.includes(linkFlag[0]) || eachVal.includes(linkFlag[1])) {
        let openSquareIdx = eachVal.indexOf("[");
        let closeSquareIdx = eachVal.indexOf("]");
        const add = eachVal.length - closeSquareIdx;
        let openIdx =
          eachVal.slice(closeSquareIdx, eachVal.length).indexOf("(") +
          closeSquareIdx;
        let closeIdx =
          eachVal.slice(closeSquareIdx, eachVal.length).indexOf(")") +
          closeSquareIdx;
        // we have to identify the link even if there exit () in link helper

        let parsedLink = eachVal.slice(openIdx + 1, closeIdx);
        let parsedLinkHelper = eachVal.slice(openSquareIdx + 1, closeSquareIdx);
        currentObj["link"] = parsedLink;
        currentObj[currentKey] = parsedLinkHelper;
        counter += 1;
        continue;
      } else {
        currentObj[currentKey] = eachVal;
      }
      counter += 1;
    }
    result.push(JSON.stringify(currentObj));

    res.push(currentObj);
  }
  return result;
}

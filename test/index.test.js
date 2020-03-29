const {
  pathAndFilename,
  filterNonCamelCaseNames,
  filterKeywords,
  makeCssModuleType,
  finalDestDir
} = require("../src/index");
const path = require("path");

test("correct path and filename", () => {
  const { currentDir, destFilename } = pathAndFilename(
    "C:\\path\\to\\the\\File.css",
    path.win32
  );

  console.log("dir!", currentDir, destFilename);
  expect(currentDir).toBe("C:\\path\\to\\the");
  expect(destFilename).toBe("FileStyles.re");
});

test("filter non-camel-cased items", () => {
  let classNames = [
    "red",
    "blue",
    "is-read",
    "is_read",
    "isRead",
    "title-box",
    "titleBox"
  ];

  expect(filterNonCamelCaseNames(classNames)).toEqual([
    "red",
    "blue",
    "isRead",
    "titleBox"
  ]);
});

test("rename items whose name is reserved word", () => {
  let classNames = ["red", "and", "forYou", "includeNext", "let"];

  let { validNames, keywordNames } = filterKeywords(classNames);

  expect(validNames).toEqual(["red", "forYou", "includeNext"]);
  expect(keywordNames).toEqual(["and", "let"]);
});

test("create valid ReasonML type", () => {
  let classNames = ["red", "forYou", "includeNext"];

  expect(makeCssModuleType(classNames)).toBe(
    `
type definition = Js.t({.
    red: string,
    forYou: string,
    includeNext: string,
})
    `.trim()
  );
});

describe("finalDestDir() tests", () => {
  test("queryDestDir if set in query", () => {
    let queryDestDir = "C:\\user\\defined\\dir";

    expect(finalDestDir(queryDestDir, "C:\\current\\directory")).toBe(
      queryDestDir
    );
  });

  test("./src/styles if not set in query", () => {
    let queryDestDir;

    expect(finalDestDir(queryDestDir, "C:\\current\\directory")).toBe(
      "./src/styles"
    );
  });

  test('currentDirectory if query.destDir is "current"', () => {
    let queryDestDir = "current";

    expect(finalDestDir(queryDestDir, "C:\\current\\directory")).toBe(
      "C:\\current\\directory"
    );
  });
});

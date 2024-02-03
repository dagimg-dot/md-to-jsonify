import { extract } from "../src/parser";
import { test, expect } from "vitest";

const correctResult = [
    '{"link":"https://devxconf.org/","Name":"DevX Conf","Location":"Online","Date":"4/28/2021"}'
]

test("extract method", async () => {
    const filePath = "./test/extractTest.md";
    const result = await extract(filePath);
    expect(result).toStrictEqual(correctResult);
});

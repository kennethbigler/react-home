import gqlReducer, { setToken } from "../gqlToken";

describe("store | modules | gql", () => {
  test("reducer", () => {
    expect(gqlReducer("", setToken("hello world"))).toEqual("hello world");
    expect(gqlReducer("hello world", setToken())).toEqual("");
  });

  test("incorrect parameters", () => {
    // @ts-expect-error: fake action for testing purposes
    expect(gqlReducer("test", { type: undefined })).toEqual("test");
    // @ts-expect-error: fake action for testing purposes
    expect(gqlReducer(undefined, { type: undefined })).toEqual("");
  });
});

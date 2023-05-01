import { render, screen } from "@testing-library/react";
import Description from "../Description";

describe("resume | graphql | Description", () => {
  it("renders as expected", () => {
    render(
      <Description
        descriptionHTML="descriptionHTML"
        primaryLanguage={{ name: "primaryLanguage" }}
        owner={{
          url: "ownerUrl",
          login: "ownerLogin",
        }}
      />
    );

    expect(screen.getByText("descriptionHTML")).toBeInTheDocument();
    expect(screen.getByText("Language: primaryLanguage")).toBeInTheDocument();
    expect(screen.getByText("Owner:")).toBeInTheDocument();
    expect(screen.getByText("ownerLogin")).toBeInTheDocument();
  });
});

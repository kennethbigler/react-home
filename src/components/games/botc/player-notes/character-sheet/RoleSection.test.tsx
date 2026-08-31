import { describe, it, expect, vi } from "vitest";
import type { ComponentProps } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RoleSection from "./RoleSection";
import type { BotCRole } from "@/jotai/botc-atom";

describe("RoleSection", () => {
  const mockRoles: BotCRole[] = [
    { name: "Villager", icon: "👤", alignment: "primary" },
    { name: "Werewolf", icon: "🐺", alignment: "error" },
    { name: "Seer", icon: "🔮", alignment: "info" },
    { name: "Doctor", icon: "🏥", alignment: "success" },
    { name: "Hunter", icon: "🏹", alignment: "warning" },
    { name: "Tanner", icon: "🎭", alignment: "secondary" },
  ];

  const mockRoleKey = {
    Villager: true,
    Seer: true,
    Hunter: true,
  };

  const renderWithTheme = (
    mode: "light" | "dark",
    props: ComponentProps<typeof RoleSection>,
  ) => {
    const theme = createTheme({ palette: { mode } });
    return render(
      <ThemeProvider theme={theme}>
        <RoleSection {...props} />
      </ThemeProvider>,
    );
  };

  const expectOutlinedRoleColor = (
    button: HTMLElement,
    mode: "light" | "dark",
    alignment: BotCRole["alignment"],
  ) => {
    const theme = createTheme({ palette: { mode } });
    const paletteColor = theme.palette[alignment];
    const expectedColor =
      mode === "light" ? paletteColor.dark : paletteColor.light;
    expect(button).toHaveStyle({ color: expectedColor });
  };

  const expectContainedRoleColor = (button: HTMLElement) => {
    expect(button).toHaveStyle({ color: "var(--variant-containedcolor)" });
  };

  it("should render the title", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
      />,
    );

    expect(screen.getByText("Town Roles")).toBeInTheDocument();
  });

  it("should render all roles as buttons", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
      />,
    );

    expect(screen.getByText("Villager")).toBeInTheDocument();
    expect(screen.getByText("Werewolf")).toBeInTheDocument();
    expect(screen.getByText("Seer")).toBeInTheDocument();
    expect(screen.getByText("Doctor")).toBeInTheDocument();
    expect(screen.getByText("Hunter")).toBeInTheDocument();
    expect(screen.getByText("Tanner")).toBeInTheDocument();
  });

  it("should render roles with text when isText is true", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
      />,
    );

    expect(screen.getByText("Villager")).toBeInTheDocument();
    expect(screen.queryByText("👤")).not.toBeInTheDocument();
  });

  it("should render roles with icons when isText is false", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={false}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
      />,
    );

    expect(screen.getByText("👤")).toBeInTheDocument();
    expect(screen.getByText("🐺")).toBeInTheDocument();
    expect(screen.getByText("🔮")).toBeInTheDocument();
    expect(screen.queryByText("Villager")).not.toBeInTheDocument();
  });

  it("should apply correct button variants based on selection", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
      />,
    );

    // Selected roles should be contained
    const villagerButton = screen.getByText("Villager");
    expect(villagerButton).toHaveClass("MuiButton-contained");

    // Unselected roles should be outlined
    const werewolfButton = screen.getByText("Werewolf");
    expect(werewolfButton).toHaveClass("MuiButton-outlined");
  });

  it("should apply correct button colors based on role alignment", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
      />,
    );

    const villagerButton = screen.getByText("Villager");
    expect(villagerButton).toHaveClass("MuiButton-colorPrimary");

    const werewolfButton = screen.getByText("Werewolf");
    expect(werewolfButton).toHaveClass("MuiButton-colorError");

    const seerButton = screen.getByText("Seer");
    expect(seerButton).toHaveClass("MuiButton-colorInfo");
  });

  it("should apply correct grid size to role buttons", () => {
    render(
      <RoleSection
        gridSize={6}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
      />,
    );

    const roleContainers = screen.getAllByText(
      /Villager|Werewolf|Seer|Doctor|Hunter|Tanner/,
    );
    roleContainers.forEach((button) => {
      const gridContainer = button.closest(".MuiGrid-root");
      expect(gridContainer).toHaveClass("MuiGrid-grid-xs-12");
    });
  });

  it("renders column-major roles in left-then-right columns when gridSize is 6", () => {
    const columnMajorRoles: BotCRole[] = [
      { name: "A", icon: "A", alignment: "primary" },
      { name: "B", icon: "B", alignment: "primary" },
      { name: "C", icon: "C", alignment: "primary" },
      { name: "D", icon: "D", alignment: "primary" },
      { name: "E", icon: "E", alignment: "primary" },
      { name: "F", icon: "F", alignment: "primary" },
    ];

    render(
      <RoleSection
        gridSize={6}
        isText={true}
        roleKey={{}}
        roles={columnMajorRoles}
        title="Script Roles"
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
    ]);

    const leftColumn = buttons[0].closest(".MuiGrid-grid-xs-6");
    const rightColumn = buttons[3].closest(".MuiGrid-grid-xs-6");
    expect(leftColumn).toContainElement(buttons[0]);
    expect(leftColumn).toContainElement(buttons[1]);
    expect(leftColumn).toContainElement(buttons[2]);
    expect(rightColumn).toContainElement(buttons[3]);
    expect(rightColumn).toContainElement(buttons[4]);
    expect(rightColumn).toContainElement(buttons[5]);
  });

  it("should center align role buttons", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
      />,
    );

    // Check that role containers have center alignment
    const roleContainers = screen.getAllByText(
      /Villager|Werewolf|Seer|Doctor|Hunter|Tanner/,
    );
    roleContainers.forEach((button) => {
      const gridContainer = button.closest(".MuiGrid-root");
      expect(gridContainer).toHaveStyle({ textAlign: "center" });
    });
  });

  it("should apply default button styles", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
      />,
    );

    const buttons = screen.getAllByText(
      /Villager|Werewolf|Seer|Doctor|Hunter|Tanner/,
    );

    buttons.forEach((button) => {
      expect(button).toHaveStyle({
        textTransform: "none",
        width: "100%",
        wordBreak: "break-word",
        paddingLeft: 0,
        paddingRight: 0,
      });
    });
  });

  it("should apply smaller font size when isText is true and roles.length >= 18", () => {
    // Create 18+ roles to trigger the small font size
    const manyRoles: BotCRole[] = Array.from({ length: 20 }, (_, i) => ({
      name: `Role${i}`,
      icon: `🎭${i}`,
      alignment: "primary" as const,
    }));

    const manyRoleKey = manyRoles.reduce(
      (acc, role) => {
        acc[role.name] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={manyRoleKey}
        roles={manyRoles}
        title="Many Roles"
      />,
    );

    const buttons = screen.getAllByText(/Role\d+/);

    buttons.forEach((button) => {
      expect(button).toHaveStyle({
        fontSize: "11.2px", // 0.7rem at 16px root (jsdom 30 computes relative units)
      });
    });
  });

  it("should not apply small font size when isText is false", () => {
    const manyRoles: BotCRole[] = Array.from({ length: 20 }, (_, i) => ({
      name: `Role${i}`,
      icon: `🎭${i}`,
      alignment: "primary" as const,
    }));

    const manyRoleKey = manyRoles.reduce(
      (acc, role) => {
        acc[role.name] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    render(
      <RoleSection
        gridSize={4}
        isText={false}
        roleKey={manyRoleKey}
        roles={manyRoles}
        title="Many Roles"
      />,
    );

    const buttons = screen.getAllByText(/🎭\d+/);

    buttons.forEach((button) => {
      expect(button).not.toHaveStyle({
        fontSize: "0.7rem",
      });
    });
  });

  it("should not apply small font size when roles.length < 18", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Few Roles"
      />,
    );

    const buttons = screen.getAllByText(
      /Villager|Werewolf|Seer|Doctor|Hunter|Tanner/,
    );

    buttons.forEach((button) => {
      expect(button).not.toHaveStyle({
        fontSize: "0.7rem",
      });
    });
  });

  it("should call onRoleClick when a role button is clicked", () => {
    const mockOnRoleClick = vi.fn(() => () => {
      // Mock implementation
    });

    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
        onRoleClick={mockOnRoleClick}
      />,
    );

    const villagerButton = screen.getByText("Villager");
    fireEvent.click(villagerButton);

    expect(mockOnRoleClick).toHaveBeenCalledWith(
      { name: "Villager", icon: "👤", alignment: "primary" },
      true,
    );
  });

  it("should not call onRoleClick when onRoleClick is not provided", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
      />,
    );

    const villagerButton = screen.getByText("Villager");
    // This should not throw an error
    expect(() => fireEvent.click(villagerButton)).not.toThrow();
  });

  it("should render horizontal rule before title", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={mockRoleKey}
        roles={mockRoles}
        title="Town Roles"
      />,
    );

    const hr = screen.getByRole("separator", { hidden: true });
    expect(hr).toBeInTheDocument();
  });

  it("should handle empty roles array", () => {
    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={{}}
        roles={[]}
        title="No Roles"
      />,
    );

    expect(screen.getByText("No Roles")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should handle roles with special characters in names", () => {
    const specialRoles: BotCRole[] = [
      { name: "Role-With-Dash", icon: "🎭", alignment: "primary" },
      { name: "Role_With_Underscore", icon: "🎪", alignment: "secondary" },
      { name: "Role With Spaces", icon: "🎨", alignment: "info" },
    ];

    const specialRoleKey = {
      "Role-With-Dash": true,
      Role_With_Underscore: false,
      "Role With Spaces": true,
    };

    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={specialRoleKey}
        roles={specialRoles}
        title="Special Roles"
      />,
    );

    expect(screen.getByText("Role-With-Dash")).toBeInTheDocument();
    expect(screen.getByText("Role_With_Underscore")).toBeInTheDocument();
    expect(screen.getByText("Role With Spaces")).toBeInTheDocument();
  });

  it("queries role buttons by accessible name in text and icon modes", () => {
    const roles: BotCRole[] = [
      { name: "Villager", icon: "👤", alignment: "primary" },
      { name: "Werewolf", icon: "🐺", alignment: "error" },
    ];

    const { rerender } = render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={{ Villager: true }}
        roles={roles}
        title="Town Roles"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Villager" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Werewolf" }),
    ).toBeInTheDocument();

    rerender(
      <RoleSection
        gridSize={4}
        isText={false}
        roleKey={{ Villager: true }}
        roles={roles}
        title="Town Roles"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Villager" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Werewolf" }),
    ).toBeInTheDocument();
  });

  it("keeps selected role buttons on contained styling in light and dark themes", () => {
    (["light", "dark"] as const).forEach((mode) => {
      const { unmount } = renderWithTheme(mode, {
        gridSize: 4,
        isText: true,
        roleKey: mockRoleKey,
        roles: mockRoles,
        title: "Town Roles",
      });

      expectContainedRoleColor(
        screen.getByRole("button", { name: "Villager" }),
      );
      expectOutlinedRoleColor(
        screen.getByRole("button", { name: "Werewolf" }),
        mode,
        "error",
      );
      unmount();
    });
  });

  it.each([
    ["light", 4],
    ["dark", 4],
    ["light", 6],
    ["dark", 6],
  ] as const)(
    "applies theme-aware outlined contrast for unselected roles in %s mode (gridSize %i)",
    (mode, gridSize) => {
      const roles: BotCRole[] = [
        { name: "Villager", icon: "👤", alignment: "primary" },
        { name: "Werewolf", icon: "🐺", alignment: "error" },
        { name: "Seer", icon: "🔮", alignment: "info" },
        { name: "Doctor", icon: "🏥", alignment: "success" },
        { name: "Hunter", icon: "🏹", alignment: "warning" },
        { name: "Tanner", icon: "🎭", alignment: "secondary" },
      ];

      renderWithTheme(mode, {
        gridSize,
        isText: true,
        roleKey: {},
        roles,
        title: "Town Roles",
      });

      const werewolfButton = screen.getByRole("button", { name: "Werewolf" });
      expectOutlinedRoleColor(werewolfButton, mode, "error");
    },
  );

  it("invokes onRoleClick from keyboard activation", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const mockOnRoleClick = vi.fn(() => handleClick);

    render(
      <RoleSection
        gridSize={4}
        isText={true}
        roleKey={{}}
        roles={mockRoles}
        title="Town Roles"
        onRoleClick={mockOnRoleClick}
      />,
    );

    mockOnRoleClick.mockClear();

    const werewolfButton = screen.getByRole("button", { name: "Werewolf" });
    werewolfButton.focus();
    await user.keyboard("{Enter}");

    expect(mockOnRoleClick).not.toHaveBeenCalled();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

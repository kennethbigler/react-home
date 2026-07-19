// Build a live search component that queries a list of results as the user types and displays them below the input.
// - Accepts a data prop — an array of { id: number, name: string, description: string }
// - As the user types, filter results and display matching items
// - Show a result count that updates as results change
// - Each result should be navigable and selectable via keyboard
// - Clicking or pressing Enter on a result selects it and shows a "selected" state
// - Screen reader users should be informed of result count changes and which item is focused
// - If no results match, communicate that to screen reader users

import { ChangeEvent, CSSProperties, useEffect, useRef, useState } from "react";

// ------------------------------     Helpers     ------------------------------ //
const srOnly: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};
const buttonStyles: CSSProperties = {
  width: "100%",
  padding: 10,
  textAlign: "left",
};
const selectedStyles: CSSProperties = {
  background: "blue",
  color: "white",
};

const NoResults = () => {
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setAnnouncement("No results found"), 100);

    return () => clearTimeout(timer);
  }, []);
  return (
    <p role="status" aria-atomic="true">
      {announcement}
    </p>
  );
};

interface Data {
  id: number;
  name: string;
  description: string;
}
const getSearchResults = (data: Data[], search: string) =>
  data.filter(
    ({ name, description }) =>
      name.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase()),
  );

// ------------------------------     Search     ------------------------------ //
interface SearchProps {
  data: Data[];
}
const Search = ({ data }: SearchProps) => {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const filteredData = [...getSearchResults(data, search)];

  const handleClick = (i: number) => () => {
    setSelected(i);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    const current = getSearchResults(data, e.target.value).length;
    if (current > 0) {
      debounceTimer.current = setTimeout(() => {
        const message = `${current} of ${data.length} results`;
        setAnnouncement("");
        setTimeout(() => setAnnouncement(message), 100);
      }, 500);
    }
  };

  return (
    <>
      <label htmlFor="search-box">Search</label>
      <span>: </span>
      <input
        id="search-box"
        type="text"
        value={search}
        onChange={handleChange}
      />
      <p role="status" aria-atomic="true" style={srOnly}>
        {announcement}
      </p>
      <p>{`${filteredData.length} of ${data.length} results`}</p>
      <section aria-label="search results">
        {filteredData.length > 0 ? (
          <ul>
            {filteredData.map(({ id, name, description }) => (
              <li
                key={id}
                style={{ listStyle: selected === id ? "inherit" : "none" }}
              >
                <button
                  style={{
                    ...buttonStyles,
                    ...(selected === id ? selectedStyles : {}),
                  }}
                  onClick={handleClick(id)}
                >
                  <b style={{ display: "block" }}>{name}</b>
                  <span>{description}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <NoResults />
        )}
      </section>
    </>
  );
};

// ------------------------------     App     ------------------------------ //
const reactData = [
  {
    id: 0,
    name: "Overview",
    description:
      "This section provides detailed reference documentation for working with React. For an introduction to React, please visit the Learn section.",
  },
  {
    id: 1,
    name: "Hooks",
    description:
      "Hooks let you use different React features from your components. You can either use the built-in Hooks or combine them to build your own. This page lists all built-in Hooks in React.",
  },
  {
    id: 2,
    name: "Components",
    description:
      "React exposes a few built-in components that you can use in your JSX.",
  },
  {
    id: 3,
    name: "APIs",
    description:
      "In addition to Hooks and Components, the react package exports a few other APIs that are useful for defining components. This page lists all the remaining modern React APIs.",
  },
  {
    id: 5,
    name: "Client APIs",
    description:
      "The react-dom/client APIs let you render React components on the client (in the browser). These APIs are typically used at the top level of your app to initialize your React tree. A framework may call them for you. Most of your components don’t need to import or use them.",
  },
  {
    id: 6,
    name: "Server APIs",
    description:
      "The react-dom/server APIs let you server-side render React components to HTML. These APIs are only used on the server at the top level of your app to generate the initial HTML. A framework may call them for you. Most of your components don’t need to import or use them.",
  },
  {
    id: 7,
    name: "Static APIs",
    description:
      "The react-dom/static APIs let you generate static HTML for React components. They have limited functionality compared to the streaming APIs. A framework may call them for you. Most of your components don’t need to import or use them.",
  },
  {
    id: 8,
    name: "Configuration",
    description:
      "This page lists all configuration options available in React Compiler.",
  },
  {
    id: 9,
    name: "Directives",
    description:
      "React Compiler directives are special string literals that control whether specific functions are compiled.",
  },
  {
    id: 10,
    name: "Compiling Libraries",
    description:
      "This guide helps library authors understand how to use React Compiler to ship optimized library code to their users.",
  },
  {
    id: 11,
    name: "React Performance tracks",
    description:
      "React Performance tracks are specialized custom entries that appear on the Performance panel’s timeline in your browser developer tools.",
  },
  {
    id: 12,
    name: "Lints",
    description:
      "eslint-plugin-react-hooks provides ESLint rules to enforce the Rules of React.",
  },
  {
    id: 13,
    name: "Rules of React",
    description:
      "Just as different programming languages have their own ways of expressing concepts, React has its own idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications.",
  },
  {
    id: 14,
    name: "Server Components",
    description:
      "Server Components are a new type of Component that renders ahead of time, before bundling, in an environment separate from your client app or SSR server.",
  },
  {
    id: 15,
    name: "Server Functions",
    description:
      "Server Functions allow Client Components to call async functions executed on the server.",
  },
  {
    id: 16,
    name: "Directives",
    description:
      "Directives provide instructions to bundlers compatible with React Server Components.",
  },
  {
    id: 17,
    name: "Legacy React APIs",
    description:
      "These APIs are exported from the react package, but they are not recommended for use in newly written code. See the linked individual API pages for the suggested alternatives.",
  },
];

const App = () => {
  return (
    <div>
      <h2>Search Engine</h2>
      <Search data={reactData} />
    </div>
  );
};

export default App;

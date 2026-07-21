// Accepts a tabs prop — an array of { label: string, content: ReactNode }
// Only one tab panel is visible at a time
// Clicking a tab makes it active and shows its panel
// Follows the ARIA tabs pattern
// Keyboard support: Arrow Left / Arrow Right to navigate between tabs, Home to go to first tab, End to go to last tab

import { KeyboardEvent, ReactNode, useRef, useState } from "react";

// The active tab and its panel should be correctly communicated to screen reader users
interface TabsContent {
  label: string;
  content: ReactNode;
}
interface TabsProps {
  name: string;
  tabs: TabsContent[];
}
const Tabs = ({ name, tabs }: TabsProps) => {
  const tabsRef = useRef(new Map());
  const [selected, setSelected] = useState(0);

  const handleClick = (i: number) => () => {
    setSelected(i);
  };

  const handleKeyboardNav = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const nextIdx = selected === 0 ? tabs.length - 1 : selected - 1;
      setSelected(nextIdx);
      tabsRef.current.get(`tab-${nextIdx}`).focus();
      return;
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = (selected + 1) % tabs.length;
      setSelected(nextIdx);
      tabsRef.current.get(`tab-${nextIdx}`).focus();
      return;
    } else if (e.key === "Home") {
      e.preventDefault();
      if (selected === 0) {
        return;
      }
      setSelected(0);
      tabsRef.current.get("tab-0").focus();
      return;
    } else if (e.key === "End") {
      e.preventDefault();
      const end = tabs.length - 1;
      if (selected === end) {
        return;
      }
      setSelected(end);
      tabsRef.current.get(`tab-${end}`).focus();
      return;
    }
  };

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        role="tablist"
        aria-label={name}
        style={{ border: "1px solid orange" }}
        onKeyDown={handleKeyboardNav}
      >
        {tabs.map(({ label }, i) => {
          const tabId = `tab-${i}`;
          return (
            <button
              role="tab"
              key={tabId}
              id={tabId}
              tabIndex={selected === i ? 0 : -1}
              aria-selected={selected === i}
              aria-controls={`panel-${i}`}
              onClick={handleClick(i)}
              style={{ margin: 10 }}
              ref={(node) => {
                if (node) {
                  tabsRef.current.set(tabId, node);
                } else {
                  tabsRef.current.delete(tabId);
                }
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div style={{ border: "1px solid green", padding: 10, marginTop: 3 }}>
        {tabs.map(({ content }, i) => (
          <div
            role="tabpanel"
            key={`panel-${i}`}
            id={`panel-${i}`}
            tabIndex={0}
            aria-labelledby={`tab-${i}`}
            hidden={selected !== i}
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  );
};

const tabData = [
  { label: "Tab 1", content: <div>Content for Tab 1</div> },
  { label: "Tab 2", content: <div>Content for Tab 2</div> },
  { label: "Tab 3", content: <div>Content for Tab 3</div> },
];

const App = () => {
  return <Tabs name="Amazing accessible example of tabs" tabs={tabData} />;
};

export default App;

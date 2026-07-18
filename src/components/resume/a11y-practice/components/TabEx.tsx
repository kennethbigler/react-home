// Accepts a tabs prop — an array of { label: string, content: ReactNode }
// Only one tab panel is visible at a time
// Clicking a tab makes it active and shows its panel
// Follows the ARIA tabs pattern
// Keyboard support: Arrow Left / Arrow Right to navigate between tabs, Home to go to first tab, End to go to last tab
// The active tab and its panel should be correctly communicated to screen reader users
const App = () => {
  return (
    <div>
      <div>┌──────────┬──────────┬──────────┐</div>
      <div>│ Tab 1 │ Tab 2 │ Tab 3 │</div>
      <div>└──────────┴──────────┴──────────┘</div>
      <div>┌─────────────────────────────────┐</div>
      <div>│ │</div>
      <div>│ Content for Tab 1 │</div>
      <div>│ │</div>
      <div>└─────────────────────────────────┘</div>
    </div>
  );
};

export default App;

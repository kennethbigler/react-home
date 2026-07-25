import { type ReactNode, useId, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import TabPanel from "./TabPanel";
import a11yTabProps from "./a11y-tab-props";
import slugifyTabPrefix from "./slugify-tab-prefix";

interface TabItem {
  label: string;
  content: ReactNode;
}

interface TabGroupProps {
  /** aria-label on Tabs; also slugified into tab id prefix */
  label: string;
  tabs: TabItem[];
  /** Rendered beside the tab list (e.g. an action button) */
  endAdornment?: ReactNode;
  defaultIndex?: number;
  /** Styles for the tab bar container (defaults to bottom divider) */
  tabBarSx?: SxProps<Theme>;
}

const defaultTabBarSx: SxProps<Theme> = {
  borderBottom: 1,
  borderColor: "divider",
};

const TabGroup = ({
  label,
  tabs,
  endAdornment,
  defaultIndex = 0,
  tabBarSx,
}: TabGroupProps) => {
  const [value, setValue] = useState(defaultIndex);
  const reactId = useId();
  const tabPrefix = `${slugifyTabPrefix(label)}-${slugifyTabPrefix(reactId)}`;

  const handleChange = (_e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={[
          defaultTabBarSx,
          endAdornment
            ? {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                pr: 1,
              }
            : {},
          ...(tabBarSx
            ? Array.isArray(tabBarSx)
              ? tabBarSx
              : [tabBarSx]
            : []),
        ]}
      >
        <Tabs value={value} onChange={handleChange} aria-label={label}>
          {tabs.map((tab, index) => (
            <Tab
              key={`${tab.label}-${index}`}
              label={tab.label}
              {...a11yTabProps(tabPrefix, index)}
            />
          ))}
        </Tabs>
        {endAdornment}
      </Box>

      {tabs.map((tab, index) => (
        <TabPanel
          key={`${tab.label}-panel-${index}`}
          value={value}
          index={index}
          tabPrefix={tabPrefix}
        >
          {tab.content}
        </TabPanel>
      ))}
    </>
  );
};

export default TabGroup;

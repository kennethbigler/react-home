import { Box } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  tabPrefix: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, tabPrefix, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${tabPrefix}panel-${index}`}
      aria-labelledby={`${tabPrefix}-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

export default TabPanel;

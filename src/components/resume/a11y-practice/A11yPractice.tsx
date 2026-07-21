import { Typography } from "@mui/material";
import TabGroup from "../../common/tab-group/TabGroup";
import StreamExampleV1 from "./v1/StreamExample";
import AnnouncementV2 from "./v2/StreamExample";
import FormFocus from "./components/FormFocus";
import Combobox from "./components/Combobox";
import NotificationBanner from "./components/NotificationBanner";
import DataTable from "./components/DataTable";
import Dialog from "./components/Dialog";
import FormValidation from "./components/FormValidation";
import TabEx from "./components/TabEx";
import Search from "./components/Search";

const A11yPractice = () => (
  <div>
    <Typography variant="h2" component="h1">
      A11y Practice
    </Typography>
    <TabGroup
      label="a11y practice tab examples"
      tabs={[
        { label: "Chunking", content: <StreamExampleV1 /> },
        { label: "+ Debounce", content: <AnnouncementV2 /> },
        { label: "Banner", content: <NotificationBanner /> },
        { label: "DataTable", content: <DataTable /> },
        { label: "Form Focus", content: <FormFocus /> },
        { label: "Combobox", content: <Combobox /> },
        { label: "Dialog", content: <Dialog /> },
        { label: "Validation", content: <FormValidation /> },
        { label: "Tabs", content: <TabEx /> },
        { label: "Search", content: <Search /> },
      ]}
    />
  </div>
);

export default A11yPractice;

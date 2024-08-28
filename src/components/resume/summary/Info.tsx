import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid2";
import ExpandableCard from "../../common/expandable-card";
import photo from "../../../images/ken.webp";
import workExp, { Job } from "../../../constants/work";

const imageStyles: React.CSSProperties = {
  width: "95%",
  display: "block",
  margin: "auto",
  marginBottom: "1em",
};

const getJob = (job: Job): string => {
  const parent = job.parent ? ` (${job.parent})` : "";
  return `${job.title}, ${job.company}${parent}`;
};

const handleClick = (): void => {
  window.open("https://www.linkedin.com/in/kennethbigler", "linkedIn");
};

const Info: React.FC = React.memo(() => (
  <Grid container spacing={1}>
    <Grid size={{ xs: 12, md: 4 }}>
      <img
        alt="Kenneth Bigler"
        onClick={handleClick}
        src={photo}
        style={imageStyles}
      />
    </Grid>
    <Grid size={{ xs: 12, md: 8 }}>
      <ExpandableCard title={getJob(workExp[0])}>
        <Table aria-label="general information about Ken Bigler">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Location
              </TableCell>
              <TableCell>Mountain View, CA</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Role
              </TableCell>
              <TableCell>Accessibility Engineer Leader</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Volunteer Work
              </TableCell>
              <TableCell>Second Harvest Food Bank</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center" component="th">
                Licenses
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <p>Driver License (C &amp; M1)</p>
                <p>GoKart Racing License</p>
                <p>Range Safety Certified</p>
                <p>
                  CPR, AED, &amp; First Aid Certified (Adult, Child, &amp; Baby)
                </p>
                <p>Golden Shellback</p>
              </TableCell>
              <TableCell>
                <p>Ordained Minister</p>
                <p>Former Magician&apos;s Assistant</p>
                <p>Former Salsa Dance Instructor</p>
                <p>Former Salsa Dance Choreographer</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ExpandableCard>
    </Grid>
  </Grid>
));

export default Info;

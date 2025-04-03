import * as React from "react";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ExpandableCard from "../../common/expandable-card";
import photo from "../../../images/ken.webp";
import workExp, { Job } from "../../../constants/work";

const imageStyles: React.CSSProperties = {
  width: "95%",
  display: "block",
  margin: "auto",
  marginTop: "40px",
};

const getJob = (job: Job): string => {
  const parent = job.parent ? ` (${job.parent})` : "";
  return `${job.title}, ${job.company}${parent}`;
};

const Info = React.memo(() => (
  <Grid container spacing={1}>
    {/* @ts-expect-error: custom breakpoints */}
    <Grid size={{ xs: 12, md: 6, xl: 4, xxl: 3, xxxl: 2 }}>
      <Link href="https://www.linkedin.com/in/kennethbigler">
        <img alt="Kenneth Bigler" src={photo} style={imageStyles} />
      </Link>
    </Grid>
    {/* @ts-expect-error: custom breakpoints */}
    <Grid size={{ xs: 12, md: 6, xl: 8, xxl: 9, xxxl: 10 }}>
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

Info.displayName = "Info";

export default Info;

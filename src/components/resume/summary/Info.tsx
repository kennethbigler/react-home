import { memo, CSSProperties } from "react";
import {
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import ExpandableCard from "../../common/expandable-card";
import photo from "../../../images/ken.webp";
import { work, Job } from "../../../constants/work";

const imageStyles: CSSProperties = {
  width: "95%",
  display: "block",
  margin: "auto",
  marginTop: "40px",
};

const getJob = (job: Job): string => {
  const parent = job.parent ? ` (${job.parent})` : "";
  return `${job.title}, ${job.company}${parent}`;
};

const Info = memo(() => (
  <Grid container spacing={1}>
    <Grid size={{ xs: 12, md: 6, xl: 4, xxl: 3, xxxl: 2 }}>
      <Link href="https://www.linkedin.com/in/kennethbigler">
        <img alt="Kenneth Bigler" src={photo} style={imageStyles} />
      </Link>
    </Grid>
    <Grid size={{ xs: 12, md: 6, xl: 8, xxl: 9, xxxl: 10 }}>
      <ExpandableCard title={getJob(work[0])}>
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
                <p>Golden Shellback/Polaris</p>
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

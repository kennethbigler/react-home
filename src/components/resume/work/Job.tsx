import type { CSSProperties } from "react";
import { Grid, Typography } from "@mui/material";
import ExpandableCard from "@/components/common/expandable-card";
import type { Job as JobType } from "@/constants/work";
import { getCSV, groupExpr, parseExprGroup } from "./jobHelpers";

interface JobProps {
  job: JobType;
  fullWidth?: boolean;
  triple?: boolean;
}

const logoStyle: CSSProperties = {
  float: "right",
  maxWidth: "7em",
  maxHeight: "4.5em",
  width: "auto",
  height: "auto",
  marginLeft: "1em",
  marginBottom: "0.75em",
  objectFit: "contain",
};

const Job = ({ job, fullWidth, triple }: JobProps) => (
  <Grid size={{ xs: 12, lg: fullWidth ? 12 : 6, xxl: triple ? 4 : undefined }}>
    <ExpandableCard
      backgroundColor={job.color}
      subtitle={job.title}
      inverted={job.inverted}
      title={`${job.company}${job.parent ? ` (${job.parent})` : ""}, ${job.location}`}
    >
      <Grid size={12} style={{ overflow: "auto" }}>
        {job.src && (
          <img
            alt={job.alt}
            src={job.src}
            loading="lazy"
            decoding="async"
            style={logoStyle}
          />
        )}
        <Typography>{job.time}</Typography>
        {job.expr && (
          <>
            {groupExpr(job.expr).map((group, groupIndex) => (
              <ul key={`expr-group${groupIndex}`}>
                {parseExprGroup(group).map((item, i) => (
                  <li key={`desc${groupIndex}-${i}`}>
                    {item.text && <Typography>{item.text}</Typography>}
                    {item.children.length > 0 && (
                      <ul>
                        {item.children.map((child, j) => (
                          <li key={`desc${groupIndex}-${i}-${j}`}>
                            <Typography>{child}</Typography>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </>
        )}
        {job.tech && job.tech.length !== 0 && (
          <>
            <hr aria-hidden />
            <Typography
              sx={{
                display: "inline",
              }}
            >
              Technologies:&nbsp;
            </Typography>
            {getCSV(job.tech)}
          </>
        )}
      </Grid>
    </ExpandableCard>
  </Grid>
);

export default Job;

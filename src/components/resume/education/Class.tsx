import * as React from "react";
import Typography from "@mui/material/Typography";

export interface ClassProps {
  name: string;
  catalog?: string;
}

/** Education  ->  Degree  -> Year  ->  Quarter  ->  Class */
const Class: React.FC<ClassProps> = React.memo(
  ({ name, catalog }: ClassProps) => (
    <li>
      <Typography>
        {catalog && <strong>{`${catalog} - `}</strong>}
        {name}
      </Typography>
    </li>
  ),
);

export default Class;

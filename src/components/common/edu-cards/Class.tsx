import { memo } from "react";
import Typography from "@mui/material/Typography";

export interface ClassProps {
  name: string;
  catalog?: string;
}

/** Degree  -> Year  ->  Quarter  ->  Class */
const Class = memo(({ name, catalog }: ClassProps) => (
  <li>
    <Typography>
      {catalog && <strong>{`${catalog} - `}</strong>}
      {name}
    </Typography>
  </li>
));

Class.displayName = "Class";

export default Class;

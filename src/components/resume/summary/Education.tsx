import * as React from "react";
import ExpandableCard from "../../common/expandable-card";
import classes, { School } from "../../../constants/classes";
import EducationSeg from "./EducationSeg";

const Education = React.memo(() => (
  <ExpandableCard title="Education">
    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
      {classes.map((d: School, i: number): React.ReactNode => {
        if (d.school) {
          return (
            <div key={i}>
              {i !== 0 && <hr aria-hidden />}
              <EducationSeg {...d} />
            </div>
          );
        }
        return null;
      })}
    </div>
  </ExpandableCard>
));

Education.displayName = "Education";

export default Education;

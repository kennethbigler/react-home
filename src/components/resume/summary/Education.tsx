import { memo, ReactElement } from "react";
import ExpandableCard from "../../common/expandable-card";
import type { School } from "../../../constants/classes";
import { summarySchools } from "../../../constants/summary";
import EducationSeg from "./EducationSeg";

const Education = memo(() => (
  <ExpandableCard title="Education">
    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
      {summarySchools.map((d: School, i: number): ReactElement | null => {
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

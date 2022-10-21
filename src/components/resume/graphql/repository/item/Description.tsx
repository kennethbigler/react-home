import React from "react";
import Typography from "@mui/material/Typography";
import { PrimaryLanguage, Owner } from "./types";

interface DescriptionProps {
  descriptionHTML: string;
  primaryLanguage: PrimaryLanguage;
  owner: Owner;
}

const Description: React.FC<DescriptionProps> = (props: DescriptionProps) => {
  const { descriptionHTML, primaryLanguage, owner } = props;

  return (
    <div className="RepositoryItem-description">
      <div
        className="RepositoryItem-description-info"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="RepositoryItem-description-details">
        {primaryLanguage && (
          <Typography display="inline">
            {`Language: ${primaryLanguage.name}`}
          </Typography>
        )}
        {owner && (
          <Typography display="inline">
            Owner: <a href={owner.url}>{owner.login}</a>
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Description;

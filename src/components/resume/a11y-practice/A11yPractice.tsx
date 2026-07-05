import { Typography } from "@mui/material";

const A11yPractice = () => {
  return (
    <div>
      <Typography variant="h2" component="h1">
        A11y Practice
      </Typography>
      <Typography>Stream Content</Typography>
      <p className="sr-only" role="status">
        Content Read by SR
      </p>
    </div>
  );
};

export default A11yPractice;

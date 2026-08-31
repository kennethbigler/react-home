import { Link as RouterLink } from "react-router";
import type { RouteMenuItem } from "../common/menu-types";
import {
  Typography,
  Avatar,
  Card,
  CardContent,
  ButtonBase,
} from "@mui/material";

interface HomeMenuItemProps {
  items: RouteMenuItem[];
  title: string;
}

const subHeaderStyles: React.CSSProperties = {
  textAlign: "left",
  marginBottom: 40,
};
const menuWrapperStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
};
const cardStyles: React.CSSProperties = {
  width: 250,
  cursor: "pointer",
  marginBottom: "20px",
};
const avatarStyles: React.CSSProperties = {
  margin: "auto",
  marginTop: 30,
  color: "white",
};

const HomeMenuItem = ({ items, title }: HomeMenuItemProps) => {
  const getPath = (route: string | undefined) => `/games/${route || ""}`;

  return (
    <>
      <hr aria-hidden style={{ marginTop: 40 }} />
      <Typography variant="h4" component="h3" style={subHeaderStyles}>
        {title}
      </Typography>
      <div style={menuWrapperStyles}>
        {items.map(({ name, route, icon }) => (
          <ButtonBase
            aria-label={`Open ${name}`}
            component={RouterLink}
            key={name}
            to={getPath(route)}
          >
            <Card sx={cardStyles}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h4"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {name}
                </Typography>
                <Avatar style={avatarStyles}>{icon}</Avatar>
              </CardContent>
            </Card>
          </ButtonBase>
        ))}
      </div>
    </>
  );
};

HomeMenuItem.displayName = "HomeMenuItem";

export default HomeMenuItem;

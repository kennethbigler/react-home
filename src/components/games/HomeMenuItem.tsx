import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ButtonBase from "@mui/material/ButtonBase";
import { MenuItem } from "./menu-items";

export interface HomeSectionProps {
  items: MenuItem[];
  title: string;
  onClick?: (loc: string) => void;
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

const HomeSection = ({ items, title, onClick }: HomeSectionProps) => (
  <>
    <hr aria-hidden style={{ marginTop: 40 }} />
    <Typography variant="h4" component="h3" style={subHeaderStyles}>
      {title}
    </Typography>
    <div style={menuWrapperStyles}>
      {items.map(({ name, route, icon }: MenuItem) => (
        <ButtonBase
          key={name}
          onClick={(): void => onClick && onClick(`/games/${route || ""}`)}
        >
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h5" component="h4" textAlign="center">
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

HomeSection.displayName = "HomeSection";

export default HomeSection;

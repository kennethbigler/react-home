import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { MenuItem } from "./menu-items";

export interface HomeSectionProps {
  items: MenuItem[];
  title: string;
  onClick?: (loc: string) => void;
}

const menuWrapperStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
};
const dividerStyles: React.CSSProperties = { marginTop: 40 };
const subHeaderStyles: React.CSSProperties = {
  textAlign: "left",
  marginBottom: 40,
};

const HomeSection = ({ items, title, onClick }: HomeSectionProps) => (
  <>
    <hr style={dividerStyles} />
    <Typography variant="h4" component="h3" style={subHeaderStyles}>
      {title}
    </Typography>
    <div style={menuWrapperStyles}>
      {items.map(({ name, route, icon }: MenuItem) => (
        <Card
          sx={{ width: 250, cursor: "pointer", marginBottom: "20px" }}
          role="link"
          tabIndex={0}
          key={name}
          onClick={(): void => onClick && onClick(`/games/${route || ""}`)}
        >
          <CardContent>
            <Typography variant="h5" component="h4" textAlign="center">
              {name}
            </Typography>
            <Avatar style={{ margin: "auto", marginTop: 30, color: "white" }}>
              {icon}
            </Avatar>
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);

HomeSection.displayName = "HomeSection";

export default HomeSection;

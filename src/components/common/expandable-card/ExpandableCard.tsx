import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import grey from '@material-ui/core/colors/grey';
import { useTheme } from '@material-ui/core/styles';
import useToggleState from '../../../hooks/useToggle';

const cardStyles: React.CSSProperties = { marginTop: 40, overflow: 'visible' };
const headerStyles: React.CSSProperties = {
  borderRadius: 3,
  marginLeft: 15,
  marginRight: 15,
  position: 'relative',
  top: -20,
};

interface ExpandableCardProps {
  /** change the background color of the title bar */
  backgroundColor?: string;
  /** content to be displayed in the main section of the card */
  children?: React.ReactNode;
  /** invert the color of the title and subtitle */
  inverted: boolean;
  /** subtitle content */
  subtitle?: string | React.ReactNode;
  /** title content */
  title?: string | React.ReactNode;
}

const ExpandableCard = (props: ExpandableCardProps): React.ReactElement => {
  const [expanded, toggleExpanded] = useToggleState(true);
  const { palette } = useTheme();
  const {
    title, subtitle, children, backgroundColor, inverted,
  } = props;

  const headerStyle = {
    ...headerStyles,
    backgroundColor: backgroundColor || palette.primary.main,
  };
  if (palette.type !== 'dark') {
    headerStyle.boxShadow = `0px 15px 15px -10px ${grey[400]}`;
  } else {
    delete headerStyle.boxShadow;
  }
  const expandedHeaderStyle = { ...headerStyle, marginBottom: -20 };

  const titleStyle = React.useMemo(() => ({ color: inverted ? 'black' : 'white' }), [inverted]);
  const subtitleStyle = React.useMemo(() => ({ color: grey[inverted ? 800 : 300] }), [inverted]);

  const titleJSX = (
    <Typography style={titleStyle} variant="h6">
      {title}
    </Typography>
  );
  const subtitleJSX = expanded ? (
    <Typography style={subtitleStyle}>
      {subtitle}
    </Typography>
  ) : null;

  return (
    <Card style={cardStyles}>
      <CardHeader
        onClick={toggleExpanded}
        style={expanded ? expandedHeaderStyle : headerStyle}
        subheader={subtitleJSX}
        title={titleJSX}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={1} style={{ overflowY: 'hidden' }}>
            {children}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

ExpandableCard.defaultProps = {
  inverted: false,
};

export default ExpandableCard;

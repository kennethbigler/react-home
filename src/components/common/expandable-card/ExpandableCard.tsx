import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withTheme, Theme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
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
  backgroundColor?: string;
  children?: React.ReactNode;
  inverted?: boolean;
  subtitle?: string | React.ReactNode;
  theme: Theme;
  title?: string | React.ReactNode;
}

const ExpandableCard: React.FC<ExpandableCardProps> = (props: ExpandableCardProps) => {
  const [expanded, toggleExpanded] = useToggleState(true);

  const {
    title, subtitle, children, backgroundColor, theme, inverted,
  } = props;

  const headerStyle = {
    ...headerStyles,
    backgroundColor: backgroundColor || theme.palette.primary.main,
  };

  if (theme.palette.type !== 'dark') {
    headerStyle.boxShadow = `0px 15px 15px -10px ${grey[400]}`;
  } else {
    delete headerStyle.boxShadow;
  }
  const expandedHeaderStyle = { ...headerStyle, marginBottom: -20 };
  const titleStyle = { color: inverted ? 'black' : 'white' };
  const subtitleStyle = { color: grey[inverted ? 800 : 300] };

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

export default withTheme(ExpandableCard);

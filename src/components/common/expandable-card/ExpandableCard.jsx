import React, { useState } from 'react';
import types from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import styles from './ExpandableCard.styles';

const ExpandableCard = (props) => {
  const [expanded, setExpanded] = useState(true);

  const {
    title, subtitle, children, backgroundColor, theme, inverted,
  } = props;

  const headerStyle = {
    ...styles.header,
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
    <Card style={styles.card}>
      <CardHeader
        onClick={() => { setExpanded(!expanded); }}
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

ExpandableCard.propTypes = {
  backgroundColor: types.string,
  children: types.oneOfType([types.arrayOf(types.node), types.node]),
  inverted: types.bool,
  subtitle: types.oneOfType([types.string, types.element]),
  theme: types.shape({
    palette: types.shape({
      primary: types.shape({
        main: types.string.isRequired,
      }).isRequired,
      type: types.string,
    }).isRequired,
  }),
  title: types.oneOfType([types.string, types.element]),
};

ExpandableCard.defaultProps = {
  inverted: false,
};

export default withTheme(ExpandableCard);

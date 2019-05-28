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

const styles = {
  card: { marginTop: 40, overflow: 'visible' },
  title: { color: 'white' },
  subtitle: { color: grey[300] },
};

const ExpandableCard = (props) => {
  const [expanded, setExpanded] = useState(true);

  const {
    title, subtitle, children, backgroundColor, theme,
  } = props;

  styles.header = {
    backgroundColor: backgroundColor || theme.palette.primary.main,
    borderRadius: 3,
    marginLeft: 15,
    marginRight: 15,
    position: 'relative',
    top: -20,
  };
  if (theme.palette.type !== 'dark') {
    styles.header.boxShadow = `0px 15px 15px -10px ${grey[400]}`;
  }
  styles.expandedHeader = {
    ...styles.header,
    marginBottom: -20,
  };

  const titleJSX = (
    <Typography style={styles.title} variant="h6">
      {title}
    </Typography>
  );
  const subtitleJSX = expanded ? (
    <Typography style={styles.subtitle}>
      {subtitle}
    </Typography>
  ) : null;

  return (
    <Card style={styles.card}>
      <CardHeader
        onClick={() => { setExpanded(!expanded); }}
        style={expanded ? styles.expandedHeader : styles.header}
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
  // types = [array, bool, func, number, object, string, symbol].isRequired
  backgroundColor: types.string,
  children: types.oneOfType([types.arrayOf(types.node), types.node]),
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

export default withTheme(ExpandableCard);

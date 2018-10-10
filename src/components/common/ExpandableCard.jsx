// react
import React, { Component } from 'react';
import types from 'prop-types';
// material ui
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

class ExpandableCard extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    backgroundColor: types.string,
    children: types.oneOfType([types.arrayOf(types.node), types.node]),
    subtitle: types.oneOfType([types.string, types.element]),
    theme: types.shape({
      palette: types.shape({
        primary: types.shape({
          main: types.string.isRequired,
        }).isRequired,
      }).isRequired,
    }),
    title: types.oneOfType([types.string, types.element]),
  };

  state = {
    expanded: true,
  };

  handleExpandChange = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  render() {
    const {
      title, subtitle, children, backgroundColor, theme,
    } = this.props;
    const { expanded } = this.state;

    const styles = {
      card: { marginTop: 40, overflow: 'visible' },
      header: {
        backgroundColor: backgroundColor || theme.palette.primary.main,
        borderRadius: 3,
        marginLeft: 15,
        marginRight: 15,
        boxShadow: `0px 15px 15px -10px ${grey[400]}`,
        position: 'relative',
        top: -20,
      },
      title: { color: 'white' },
      subtitle: { color: grey[300] },
    };
    styles.expandedHeader = {
      ...styles.header,
      marginBottom: -20,
    };

    const titleJSX = (
      <Typography style={styles.title} variant="h6">
        {title}
      </Typography>
    );
    const subtitleJSX = (
      <Typography style={styles.subtitle}>
        {subtitle}
      </Typography>
    );

    return (
      <Card style={styles.card}>
        <CardHeader
          onClick={this.handleExpandChange}
          style={expanded ? styles.expandedHeader : styles.header}
          subheader={subtitleJSX}
          title={titleJSX}
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container spacing={16}>
              {children}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

export default withTheme()(ExpandableCard);

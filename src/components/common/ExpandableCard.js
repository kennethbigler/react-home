// react
import React, {Component} from 'react';
import types from 'prop-types';
// material ui
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import {withTheme} from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

export class EC extends Component {
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
    this.setState({expanded: !this.state.expanded});
  };

  render() {
    const {title, subtitle, children, backgroundColor, theme} = this.props;
    const {expanded} = this.state;

    let styles = {
      card: {marginTop: 40, overflow: 'visible'},
      header: {
        backgroundColor: backgroundColor
          ? backgroundColor
          : theme.palette.primary.main,
        borderRadius: 3,
        marginLeft: 15,
        marginRight: 15,
        boxShadow: `0px 15px 15px -10px ${grey[400]}`,
        position: 'relative',
        top: -20,
      },
      title: {color: 'white'},
      subtitle: {color: grey[300]},
    };

    return (
      <Card style={styles.card}>
        <CardHeader
          onClick={this.handleExpandChange}
          style={styles.header}
          subheader={
            <Typography style={styles.subtitle}>{subtitle}</Typography>
          }
          title={
            <Typography style={styles.title} variant="title">
              {title}
            </Typography>
          }
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <div className="row">{children}</div>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

export const ExpandableCard = withTheme()(EC);

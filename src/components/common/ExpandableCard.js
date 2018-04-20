// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// material ui
import { Card, CardTitle, CardText } from 'material-ui/Card';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as colors from 'material-ui/styles/colors';

export class EC extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    backgroundColor: PropTypes.string,
    muiTheme: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  state = {
    expanded: true
  };

  handleExpandChange = expanded => {
    this.setState({ expanded });
  };

  render() {
    const {
      title,
      subtitle,
      children,
      backgroundColor,
      muiTheme,
      ...otherProps
    } = this.props;
    const { expanded } = this.state;

    let styles = {
      card: { marginTop: 40 },
      closedCard: { marginTop: 20 },
      closed: {
        backgroundColor: backgroundColor
          ? backgroundColor
          : muiTheme.palette.primary1Color,
        borderRadius: 3,
        marginLeft: 10,
        marginRight: 10,
        boxShadow: `0px 15px 15px -10px ${colors.grey400}`
      }
    };
    styles['open'] = {
      ...styles.closed,
      top: -20,
      marginLeft: 15,
      marginRight: 15
    };

    const style = expanded ? styles.open : styles.closed;

    return (
      <Card
        expanded={expanded}
        onExpandChange={this.handleExpandChange}
        style={expanded ? styles.card : styles.closedCard}
        {...otherProps}
      >
        <CardTitle
          actAsExpander
          style={style}
          subtitle={subtitle}
          subtitleColor={colors.grey400}
          title={title}
          titleColor={colors.white}
        />
        <CardText expandable>
          <div className="row">{children}</div>
        </CardText>
      </Card>
    );
  }
}

export const ExpandableCard = muiThemeable()(EC);

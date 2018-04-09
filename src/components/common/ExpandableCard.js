// react
import React from 'react';
import PropTypes from 'prop-types';
// material ui
import { Card, CardTitle, CardText } from 'material-ui/Card';
import * as colors from 'material-ui/styles/colors';

export const ExpandableCard = props => {
  const { title, subtitle, children, backgroundColor, ...otherProps } = props;

  return (
    <Card {...otherProps} style={{ marginTop: 40 }} initiallyExpanded>
      <CardTitle
        title={title && title}
        subtitle={subtitle && subtitle}
        titleColor={colors.white}
        subtitleColor={colors.grey400}
        actAsExpander
        showExpandableButton
        style={{
          backgroundColor: backgroundColor,
          marginLeft: 15,
          marginRight: 15,
          top: -20,
          borderRadius: 2,
          boxShadow: `0px 15px 15px -10px ${colors.grey400}`
        }}
      />
      <CardText expandable>
        <div className="row">{children}</div>
      </CardText>
    </Card>
  );
};

ExpandableCard.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  backgroundColor: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

ExpandableCard.defaultProps = {
  backgroundColor: colors.grey900
};

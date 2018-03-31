import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';

export const ExpandableCard = props => {
  const { expanded, onExpandChange, title, subtitle, children } = props;
  return (
    <Card expanded={expanded} onExpandChange={onExpandChange}>
      <CardTitle
        title={title && title}
        subtitle={subtitle && subtitle}
        actAsExpander
        showExpandableButton
      />
      <CardText expandable>
        <div className="row">{children}</div>
      </CardText>
    </Card>
  );
};

ExpandableCard.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  expanded: PropTypes.bool.isRequired,
  onExpandChange: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

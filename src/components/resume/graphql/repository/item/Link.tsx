import React from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode | React.ReactNodeArray;
}

const Link: React.FC<LinkProps> = (props: LinkProps) => {
  const { children, ...otherProps } = props;
  return (
    <a {...otherProps} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default Link;

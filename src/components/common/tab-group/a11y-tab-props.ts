const a11yTabProps = (tabPrefix: string, index: number) => {
  return {
    id: `${tabPrefix}-${index}`,
    "aria-controls": `${tabPrefix}panel-${index}`,
  };
};

export default a11yTabProps;

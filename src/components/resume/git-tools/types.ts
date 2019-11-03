type MaterialSelect = { name?: string | undefined; value: unknown };
export type MaterialSelectEvent = React.ChangeEvent<MaterialSelect>;
export type MaterialSelectEventHandler = (e: MaterialSelectEvent) => void;

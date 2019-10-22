export interface StarGazers {
  totalCount: number;
}
export interface StarRepositoryProps {
  id: string;
  stargazers: StarGazers;
}
export interface PrimaryLanguage {
  name: string;
}
export interface Owner {
  url?: string;
  login?: string;
}
export interface Watchers {
  totalCount: number;
}

export type Group = {
  name: string;
  connections: Connection[];
};
export type Connection = {
  connectionId: string;
  username: string;
};

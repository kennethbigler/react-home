import { atom } from "recoil";

const gqlTokenAtom = atom({
  key: "gqlTokenAtom",
  default: JSON.parse(localStorage.getItem("gql-token-atom") || '""') as string,
  effects: [
    ({ onSet }) => {
      onSet((newToken) => {
        localStorage.setItem("gql-token-atom", JSON.stringify(newToken));
      });
    },
  ],
});

export default gqlTokenAtom;

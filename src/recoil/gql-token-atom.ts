import { atom } from "recoil";

const gqlTokenAtom = atom({
  key: "gqlTokenAtom",
  default: JSON.parse(localStorage.getItem("gql-token-atom") || '""') as string,
  effects: [
    ({ onSet }) => {
      onSet((newReel) => {
        localStorage.setItem("gql-token-atom", JSON.stringify(newReel));
      });
    },
  ],
});

export default gqlTokenAtom;

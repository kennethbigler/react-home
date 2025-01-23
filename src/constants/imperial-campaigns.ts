export interface Mission {
  /** Is this a side mission or a story mission? */
  isSide: boolean;
  /** Rebels have shopped? */
  rShop: boolean;
  /** Empire has shopped? */
  eShop: boolean;
  /** Mission has been completed, 0 for no, 1 for Rebel Victory, 2 for Empire Victory */
  victory: number;
  /** What level items can be purchased from the rebel shop */
  shop: string;
  /** Threat level for Empire in game */
  threat: number;
  /** Title of selected mission, some are pre-populated */
  title: string;
}
const std = {
  isSide: false,
  victory: 0,
  rShop: false,
  eShop: false,
  title: "",
};

export const getForcedMission = (threat: number): Mission => ({
  ...std,
  isSide: true,
  threat,
  shop: "",
});

export const basic: Mission[] = [
  { ...std, threat: 2, shop: "1", title: "Aftermath" },
  { ...std, threat: 2, shop: "1", isSide: true },
  { ...std, threat: 3, shop: "1" },
  { ...std, threat: 3, shop: "1 & 2", isSide: true },
  { ...std, threat: 4, shop: "2" },
  { ...std, threat: 4, shop: "2", isSide: true },
  { ...std, threat: 4, shop: "2 & 3", isSide: true },
  { ...std, threat: 5, shop: "3" },
  { ...std, threat: 5, shop: "3", isSide: true },
  { ...std, threat: 6, shop: "3" },
  { ...std, threat: 6, shop: "" },
];

export const twinShadows: Mission[] = [
  { ...std, threat: 3, shop: "1 & 2", title: "Hunted Down" },
  { ...std, threat: 4, shop: "2" },
  { ...std, threat: 5, shop: "2 & 3" },
  { ...std, threat: 5, shop: "" },
];

export const returnToHoth: Mission[] = [
  { ...std, threat: 2, shop: "1", title: "The Battle of Hoth" },
  { ...std, threat: 2, shop: "1", isSide: true },
  { ...std, threat: 3, shop: "1" },
  { ...std, threat: 3, shop: "1 & 2", isSide: true },
  { ...std, threat: 4, shop: "2", isSide: true },
  { ...std, threat: 4, shop: "2", title: "Return to Echo Base" },
  { ...std, threat: 4, shop: "2 & 3" },
  { ...std, threat: 5, shop: "3", isSide: true },
  { ...std, threat: 5, shop: "3", isSide: true },
  { ...std, threat: 6, shop: "3" },
  { ...std, threat: 6, shop: "", title: "Our Last Hope" },
];

export const bespinGambit: Mission[] = [
  { ...std, threat: 3, shop: "1 & 2", title: "Reclamation" },
  { ...std, threat: 4, shop: "2" },
  { ...std, threat: 5, shop: "2 & 3" },
  { ...std, threat: 5, shop: "" },
];

export const jabbasRealm: Mission[] = [
  { ...std, threat: 2, shop: "1", title: "Trespass" },
  { ...std, threat: 2, shop: "1", isSide: true },
  { ...std, threat: 3, shop: "1" },
  { ...std, threat: 3, shop: "1 & 2", isSide: true },
  { ...std, threat: 4, shop: "2" },
  { ...std, threat: 4, shop: "2", isSide: true },
  { ...std, threat: 4, shop: "2 & 3", title: "Moment of Fate" },
  { ...std, threat: 5, shop: "3" },
  { ...std, threat: 5, shop: "3", isSide: true },
  { ...std, threat: 6, shop: "3" },
  { ...std, threat: 6, shop: "" },
];

export const heartOfTheEmpire: Mission[] = [
  { ...std, threat: 2, shop: "1", title: "Dark Recon" },
  { ...std, threat: 2, shop: "1", isSide: true },
  { ...std, threat: 3, shop: "1 & 2" },
  { ...std, threat: 3, shop: "1 & 2", isSide: true },
  { ...std, threat: 4, shop: "2" },
  { ...std, threat: 4, shop: "2 & 3", isSide: true },
  { ...std, threat: 5, shop: "2 & 3" },
  { ...std, threat: 5, shop: "" },
];

export const tyrantsOfLothal: Mission[] = [
  { ...std, threat: 3, shop: "1 & 2", title: "Call to Action" },
  { ...std, threat: 4, shop: "2", isSide: true, title: "The Pirate's Plot" },
  { ...std, threat: 4, shop: "2" },
  { ...std, threat: 5, shop: "2", isSide: true },
  { ...std, threat: 5, shop: "2 & 3" },
  { ...std, threat: 6, shop: "3", isSide: true, title: "The Admiral's Grip" },
  { ...std, threat: 6, shop: "", title: "The Final Order" },
];

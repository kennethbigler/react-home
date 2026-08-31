import { useAtomValue, useSetAtom } from "jotai";
import impAssAtom, {
  impAssCampaignAtom,
  impAssCampaignIdxAtom,
  impAssCreditsAtom,
  impAssForcedMissionsAtom,
  impAssInfluenceAtom,
  impAssRebelXPAtom,
  impAssXPAtom,
} from "@/jotai/imperial-assault-atom";
import {
  basic,
  twinShadows,
  returnToHoth,
  bespinGambit,
  jabbasRealm,
  heartOfTheEmpire,
  tyrantsOfLothal,
  getForcedMission,
  type Mission,
} from "@/constants/imperial-campaigns";

const campaigns = [
  basic,
  twinShadows,
  returnToHoth,
  bespinGambit,
  jabbasRealm,
  heartOfTheEmpire,
  tyrantsOfLothal,
];

/** Immutable single-mission patch, shared by the mission actions */
const withMission = (
  missions: Mission[],
  i: number,
  patch: Partial<Mission>,
): Mission[] => {
  const newMissions = [...missions];
  newMissions[i] = { ...newMissions[i], ...patch };
  return newMissions;
};

export const useHeader = () => {
  const campaignIdx = useAtomValue(impAssCampaignIdxAtom);
  const setState = useSetAtom(impAssAtom);

  /** handle campaign changes */
  const handleCampaignChange = (cIdx: string) => {
    const newCampaign = [...campaigns[parseInt(cIdx)]];

    let newCredits = "0";
    let newRebelXP = [0, 0, 0, 0];
    let newXP = 0;
    if (cIdx === "1" || cIdx === "3") {
      // If Twin Shadows || The Bespin Gambit
      newRebelXP = [3, 3, 3, 3];
      newCredits = "400";
      newXP = 3;
    } else if (cIdx === "6") {
      // If Tyrants of Lothal
      newRebelXP = [2, 2, 2, 2];
      newCredits = "300";
      newXP = 2;
    }

    setState({
      campaignIdx: cIdx,
      campaign: newCampaign,
      forcedMissions: [getForcedMission(newCampaign[0].threat)],
      credits: newCredits,
      rebelXP: newRebelXP,
      xp: newXP,
      influence: 0,
    });
  };

  return { campaignIdx, handleCampaignChange };
};

export const useRebels = () => {
  const rebelXP = useAtomValue(impAssRebelXPAtom);
  const credits = useAtomValue(impAssCreditsAtom);
  const setState = useSetAtom(impAssAtom);

  const handleXPClick = (r: number, n: number) => () =>
    setState((prev) => {
      const xp = [...prev.rebelXP];
      xp[r] = n;
      return { ...prev, rebelXP: xp };
    });

  const updateCredits = (e: React.FocusEvent<HTMLInputElement>) =>
    setState((prev) => ({ ...prev, credits: e.target.value || "" }));

  return { rebelXP, credits, handleXPClick, updateCredits };
};

export const useEmpire = () => {
  const xp = useAtomValue(impAssXPAtom);
  const influence = useAtomValue(impAssInfluenceAtom);
  const setState = useSetAtom(impAssAtom);

  const handleXPClick = (n: number) => () =>
    setState((prev) => ({ ...prev, xp: n }));
  const handleInfluenceClick = (n: number) => () =>
    setState((prev) => ({ ...prev, influence: n }));

  return { xp, influence, handleXPClick, handleInfluenceClick };
};

export const useMissions = () => {
  const campaign = useAtomValue(impAssCampaignAtom);
  const setState = useSetAtom(impAssAtom);

  const handleVictoryClick = (i: number) => () => {
    if (campaign[i].title === "") {
      return;
    }
    setState((prev) => {
      // update campaign victory
      const newCampaign = withMission(prev.campaign, i, {
        victory: (prev.campaign[i].victory + 1) % 3,
      });
      // update forced mission threat
      let newFMs = prev.forcedMissions;
      const last = newFMs.length - 1;
      if (newFMs[last].title === "") {
        newFMs = withMission(newFMs, last, { threat: newCampaign[i].threat });
      }
      return { ...prev, forcedMissions: newFMs, campaign: newCampaign };
    });
  };

  const handleRShopClick = (i: number) => () => {
    if (!campaign[i].victory && !campaign[i].rShop) {
      return;
    }
    setState((prev) => ({
      ...prev,
      campaign: withMission(prev.campaign, i, {
        rShop: !prev.campaign[i].rShop,
      }),
    }));
  };

  const handleEShopClick = (i: number) => () => {
    if (!campaign[i].victory && !campaign[i].eShop) {
      return;
    }
    setState((prev) => ({
      ...prev,
      campaign: withMission(prev.campaign, i, {
        eShop: !prev.campaign[i].eShop,
      }),
    }));
  };

  const updateMissionName =
    (i: number) => (e: React.FocusEvent<HTMLInputElement>) => {
      setState((prev) => ({
        ...prev,
        campaign: withMission(prev.campaign, i, {
          title: e.target.value || "",
        }),
      }));
    };

  return {
    campaign,
    handleRShopClick,
    handleEShopClick,
    handleVictoryClick,
    updateMissionName,
  };
};

export const useForcedMissions = () => {
  const forcedMissions = useAtomValue(impAssForcedMissionsAtom);
  const setState = useSetAtom(impAssAtom);

  const handleVictoryClick = (i: number) => () => {
    if (forcedMissions[i].title === "") {
      return;
    }
    setState((prev) => {
      const newForcedMissions = withMission(prev.forcedMissions, i, {
        victory: (prev.forcedMissions[i].victory + 1) % 3,
      });
      // add new forced mission
      if (i === prev.forcedMissions.length - 1) {
        newForcedMissions.push(getForcedMission(prev.forcedMissions[i].threat));
      }
      return { ...prev, forcedMissions: newForcedMissions };
    });
  };

  const updateMissionName =
    (i: number) => (e: React.FocusEvent<HTMLInputElement>) => {
      setState((prev) => ({
        ...prev,
        forcedMissions: withMission(prev.forcedMissions, i, {
          title: e.target.value || "",
        }),
      }));
    };

  return { forcedMissions, handleVictoryClick, updateMissionName };
};

import { useAtom } from "jotai";
import impAssAtom from "../../../jotai/imperial-assault-atom";
import {
  basic,
  twinShadows,
  returnToHoth,
  bespinGambit,
  jabbasRealm,
  heartOfTheEmpire,
  tyrantsOfLothal,
  getForcedMission,
} from "../../../constants/imperial-campaigns";

const campaigns = [
  basic,
  twinShadows,
  returnToHoth,
  bespinGambit,
  jabbasRealm,
  heartOfTheEmpire,
  tyrantsOfLothal,
];

export const useHeader = () => {
  const [{ campaignIdx }, setState] = useAtom(impAssAtom);

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
  const [{ rebelXP, credits, ...other }, setState] = useAtom(impAssAtom);

  const handleXPClick = (r: number, n: number) => () => {
    const xp = [...rebelXP];
    xp[r] = n;
    setState({ ...other, credits, rebelXP: xp });
  };

  const updateCredits = (e: React.FocusEvent<HTMLInputElement>) =>
    setState({ ...other, rebelXP, credits: e.target.value || "" });

  return { rebelXP, credits, handleXPClick, updateCredits };
};

export const useEmpire = () => {
  const [{ xp, influence, ...other }, setState] = useAtom(impAssAtom);
  const handleXPClick = (n: number) => () =>
    setState({ ...other, influence, xp: n });
  const handleInfluenceClick = (n: number) => () =>
    setState({ ...other, xp, influence: n });

  return { xp, influence, handleXPClick, handleInfluenceClick };
};

export const useMissions = () => {
  const [{ campaign, forcedMissions, ...other }, setState] =
    useAtom(impAssAtom);

  const handleVictoryClick = (i: number) => () => {
    // update campaign victory
    const newCampaign = [...campaign];
    const newMission = {
      ...campaign[i],
      victory: (campaign[i].victory + 1) % 3,
    };
    newCampaign[i] = newMission;
    // update forced mission threat
    const newFMs = [...forcedMissions];
    const last = newFMs.length - 1;
    if (newFMs[last].title === "") {
      const newFM = { ...newFMs[last], threat: newCampaign[i].threat };
      newFMs[last] = newFM;
    }
    // update state
    setState({ ...other, forcedMissions: newFMs, campaign: newCampaign });
  };

  const handleRShopClick = (i: number) => () => {
    if (!campaign[i].victory && !campaign[i].rShop) {
      return;
    }
    const newCampaign = [...campaign];
    const newMission = { ...campaign[i], rShop: !campaign[i].rShop };
    newCampaign[i] = newMission;
    setState({ ...other, forcedMissions, campaign: newCampaign });
  };

  const handleEShopClick = (i: number) => () => {
    if (!campaign[i].victory && !campaign[i].eShop) {
      return;
    }
    const newCampaign = [...campaign];
    const newMission = { ...campaign[i], eShop: !campaign[i].eShop };
    newCampaign[i] = newMission;
    setState({ ...other, forcedMissions, campaign: newCampaign });
  };

  const updateMissionName =
    (i: number) => (e: React.FocusEvent<HTMLInputElement>) => {
      const newCampaign = [...campaign];
      const newMission = { ...campaign[i], title: e.target.value || "" };
      newCampaign[i] = newMission;
      setState({ ...other, forcedMissions, campaign: newCampaign });
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
  const [{ forcedMissions, ...other }, setState] = useAtom(impAssAtom);

  const handleVictoryClick = (i: number) => () => {
    const newForcedMissions = [...forcedMissions];
    newForcedMissions[i].victory = (forcedMissions[i].victory + 1) % 3;

    setState({ ...other, forcedMissions: newForcedMissions });
  };

  const updateMissionName =
    (i: number) => (e: React.FocusEvent<HTMLInputElement>) => {
      const newFMs = [...forcedMissions];
      const newMission = { ...newFMs[i], title: e.target.value || "" };
      newFMs[i] = newMission;
      setState({ ...other, forcedMissions: newFMs });
    };

  return { forcedMissions, handleVictoryClick, updateMissionName };
};

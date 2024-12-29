interface ScoreData {
  bid: number;
  blind: boolean;
  train: boolean;
  made: number;
}
const getScore = (p1: ScoreData, p2: ScoreData) => {
  // double blind nil
  if (p1.blind && p2.blind && p1.made === 0 && p2.made === 0) {
    return 800;
  }
  // double nil
  if (p1.bid === 0 && p2.bid === 0 && p1.made === 0 && p2.made === 0) {
    return 400;
  }
  // trains
  if ((p1.train || p2.train) && p1.made + p2.made >= 10) {
    // trains + bags
    return 200 + (p1.made + p2.made - 10);
  }
  const score = 0;
};
// TODO: score bags separately, maybe divide by 10 and just count bags separate.

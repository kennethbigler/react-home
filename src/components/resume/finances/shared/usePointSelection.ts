import { useState } from "react";

/**
 * Chart point selection shared by the comp and net worth graph pairs:
 * `safeStartIdx` anchors the inflation series and `pieIdx` drives the
 * breakdown pie (following the latest entry until a point is clicked).
 */
const usePointSelection = (lastIdx: number) => {
  const [startIdx, setStartIdx] = useState(0);
  // null = follow the latest entry until the user selects a point
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handlePointSelect = (index: number) => {
    setStartIdx(index);
    setSelectedIdx(index);
  };

  return {
    safeStartIdx: Math.min(startIdx, lastIdx),
    pieIdx: Math.min(selectedIdx ?? lastIdx, lastIdx),
    handlePointSelect,
  };
};

export default usePointSelection;

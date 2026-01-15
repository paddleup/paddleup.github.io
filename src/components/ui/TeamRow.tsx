import React from "react";
import MobileScoreInput from "./MobileScoreInput";
import PlayerAvatar from "./PlayerAvatar";
import { Player } from "../../types";

interface TeamRowProps {
  color: "primary" | "success";
  player1: Player | undefined;
  player2: Player | undefined;
  score: number | undefined;
  onScoreChange: (score: number) => void;
  isAdmin: boolean;
  isEditable?: boolean;
}

const TeamRow: React.FC<TeamRowProps> = ({
  color,
  player1,
  player2,
  score,
  onScoreChange,
  isAdmin,
  isEditable,
}) => (
  <div className="flex items-center justify-between py-1.5">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="flex items-center gap-1 min-w-0">
        <span className="flex items-center gap-1 min-w-0">
          <PlayerAvatar imageUrl={player1?.imageUrl} name={player1?.name} size="sm" />
          <span className="text-base font-normal text-text-main truncate">{player1?.name || "Player"}</span>
        </span>
        <span className="mx-1 text-text-muted font-light text-lg">&amp;</span>
        <span className="flex items-center gap-1 min-w-0">
          <PlayerAvatar imageUrl={player2?.imageUrl} name={player2?.name} size="sm" />
          <span className="text-base font-normal text-text-main truncate">{player2?.name || "Player"}</span>
        </span>
      </div>
    </div>
    {/* Pass maxScore prop based on number of players in the team */}
    <MobileScoreInput
      value={score}
      onChange={onScoreChange}
      isAdmin={isAdmin}
      teamColor={color}
      disabled={isEditable === false}
    />
  </div>
);

export default TeamRow;

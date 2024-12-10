import { ping } from "./ping.js";
import { help } from "./help.js";
import { kick } from "./kick.js";
import { start } from "./game/start.js";
import { join } from "./game/join.js";
import { begin } from "./game/begin.js";
import { play } from "../games/ClashOfCards/commands/play.js";
import { players } from "../games/ClashOfCards/commands/players.js";
import { quit } from "../games/ClashOfCards/commands/quit.js";
import { skip } from "../games/ClashOfCards/commands/skip.js";
import { roundinfo } from "../games/ClashOfCards/commands/roundinfo.js";
import { hand } from "../games/ClashOfCards/commands/hand.js";
import { forceround } from "../games/ClashOfCards/commands/forceround.js";
import { end } from "../games/ClashOfCards/commands/end.js";
import { reset } from "../games/ClashOfCards/commands/reset.js";
import { leaderboardCommand } from "../games/ClashOfCards/commands/leaderboard.js";
import { achievements } from "../games/ClashOfCards/commands/achievements.js";
import { uploadImage } from "./uploadImage.js";
import { logger } from "../utils/logger.js";
import { give } from "../games/ClashOfCards/commands/give.js";

export const commands = new Map([
  ["ping", ping],
  ["help", help],
  ["kick", kick],
  ["start", start],
  ["join", join],
  ["begin", begin],
  ["play", play],
  ["players", players],
  ["quit", quit],
  ["skip", skip],
  ["roundinfo", roundinfo],
  ["hand", hand],
  ["forceround", forceround],
  ["end", end],
  ["reset", reset],
  ["leaderboard", leaderboardCommand],
  ["achievements", achievements],
  ["uploadimage", uploadImage],
  ["give", give],
]);

// Log available commands
logger.info("Initialized commands", {
  availableCommands: Array.from(commands.keys()),
});

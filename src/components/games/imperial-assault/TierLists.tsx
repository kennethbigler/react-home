import Grid from "@mui/material/Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ExpandableCard from "../../common/expandable-card";

interface DeploymentCards {
  name: string;
  reg?: string;
  elite?: string;
  cost?: string;
  bh?: boolean;
  divider?: boolean;
}

const deploymentCards: DeploymentCards[] = [
  { name: "S-Tier", divider: true },
  { name: "Nexu", reg: "S+", elite: "A", cost: "⬜️ 4 🟥 6", bh: true },
  { name: "Hired Gun", reg: "S", elite: "A", cost: "⬜️ 4/2 🟥 6/3", bh: true },

  { name: "A-Tier", divider: true },
  { name: "Sentry Droid", reg: "C+", elite: "A+", cost: "⬜️ 6/3 🟥 10/5" },
  { name: "Riot Trooper", reg: "A-", elite: "A+", cost: "⬜️ 5/2 🟥 7/3" },
  { name: "Jet Trooper", reg: "B+", elite: "A+", cost: "⬜️ 4/2 🟥 7/4" },
  { name: "Loth-cat", reg: "B+", elite: "A+", cost: "⬜️ 4/2 🟥 6/3", bh: true },
  { name: "Dewback Rider", reg: "-", elite: "A+", cost: "🟥 5" },
  { name: "AT-DP", reg: "-", elite: "A+", cost: "🟥 9" },
  { name: "Death Trooper", reg: "A", elite: "A", cost: "⬜️ 3 🟥 4" },
  { name: "Stormtrooper", reg: "B", elite: "A", cost: "⬜️ 6/2 🟥 9/3" },
  {
    name: "Trandoshan Hunter",
    reg: "A",
    elite: "C",
    cost: "⬜️ 7/3 🟥 10/5",
    bh: true,
  },
  {
    name: "Jawa Scavenger",
    reg: "A-",
    elite: "A-",
    cost: "⬜️ 2 🟥 3",
    bh: true,
  },
  {
    name: "Gamorrean Guard",
    reg: "D-",
    elite: "A-",
    cost: "⬜️ 6/3 🟥 8/4",
    bh: true,
  },
  { name: "Heavy Stormtrooper", reg: "C+", elite: "A-", cost: "⬜️ 6/3 🟥 8/4" },

  { name: "B-Tier", divider: true },
  { name: "Royal Guard", reg: "B+", elite: "C", cost: "⬜️ 8/4 🟥 12/6" },
  {
    name: "Weequay Pirate",
    reg: "B",
    elite: "B+",
    cost: "⬜️ 5/3 🟥 7/4",
    bh: true,
  },
  { name: "ISB Infiltrator", reg: "C+", elite: "B+", cost: "⬜️ 5/3 🟥 7/4" },
  { name: "Probe Droid", reg: "C+", elite: "B", cost: "⬜️ 3 🟥 5" },
  {
    name: "Ugnaught Tinkerer",
    reg: "C",
    elite: "B",
    cost: "⬜️ 3 🟥 5",
    bh: true,
  },
  {
    name: "HK Assassin Droid",
    reg: "B",
    elite: "D",
    cost: "⬜️ 8/4 🟥 11/6",
    bh: true,
  },
  {
    name: "Wing Guard",
    reg: "C+",
    elite: "B-",
    cost: "⬜️ 6/2 🟥 9/3",
    bh: true,
  },
  {
    name: "Clawdite Shapeshifter",
    reg: "C-",
    elite: "B-",
    cost: "⬜️ 4 🟥 6",
    bh: true,
  },
  { name: "SC2-M Repulsor Tank", reg: "-", elite: "B-", cost: "🟥 10" },
  { name: "E-Web Engineer", reg: "C-", elite: "B-", cost: "⬜️ 6 🟥 8" },

  { name: "C-Tier", divider: true },
  {
    name: "Tusken Raider",
    reg: "D+",
    elite: "C",
    cost: "⬜️ 5/2 🟥 7/3",
    bh: true,
  },
  { name: "Imperial Officer", reg: "C", elite: "D+", cost: "⬜️ 2 🟥 5" },
  { name: "Bantha Rider", reg: "-", elite: "C-", cost: "🟥 9", bh: true },
  { name: "Rancor", reg: "-", elite: "C-", cost: "🟥 10", bh: true },
  { name: "Snowtrooper", reg: "C-", elite: "D", cost: "⬜️ 7/2 🟥 10/3" },

  { name: "D-Tier", divider: true },
  { name: "Wampa", reg: "D", elite: "D+", cost: "⬜️ 5 🟥 8", bh: true },
  { name: "AT-ST", reg: "-", elite: "D-", cost: "🟥 14" },
];

const TierLists = () => (
  <ExpandableCard title="Tier Lists">
    <Grid container spacing={4} size={12}>
      <Grid size={{ xs: 12, sm: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rebel Hero</TableCell>
              <TableCell>Imperial Class Deck</TableCell>
              <TableCell>Rank</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow selected>
              <TableCell colSpan={3} align="center">
                S-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gideon Argus</TableCell>
              <TableCell>Subversive Tactics</TableCell>
              <TableCell>S+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fenn Signis</TableCell>
              <TableCell>Military Might</TableCell>
              <TableCell>S</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Diala Passil</TableCell>
              <TableCell>Hutt Mercenaries</TableCell>
              <TableCell>S</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Shyla Varad</TableCell>
              <TableCell></TableCell>
              <TableCell>S</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Vinto Hreeda</TableCell>
              <TableCell></TableCell>
              <TableCell>S-</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell colSpan={3} align="center">
                A-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mak Eshka&apos;rey</TableCell>
              <TableCell>Reactive Defenses</TableCell>
              <TableCell>A+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Drokkatta</TableCell>
              <TableCell>Tech Superiority</TableCell>
              <TableCell>A+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Varena Talos</TableCell>
              <TableCell></TableCell>
              <TableCell>A+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gaarkhan</TableCell>
              <TableCell>Nemeses</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jyn Odan</TableCell>
              <TableCell>Power of the Dark Side</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>MDH-19</TableCell>
              <TableCell></TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ko-Tun Feralo</TableCell>
              <TableCell></TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Onar Koma</TableCell>
              <TableCell></TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Murne Rin</TableCell>
              <TableCell></TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jarrod Kelvin</TableCell>
              <TableCell>Imperial Black Ops</TableCell>
              <TableCell>A-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Davith Elso</TableCell>
              <TableCell>Precision Training</TableCell>
              <TableCell>A-</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell colSpan={3} align="center">
                B-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Loku Kanoloa</TableCell>
              <TableCell>Armored Onslaught</TableCell>
              <TableCell>B+</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell colSpan={3} align="center">
                C-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Saska Teft</TableCell>
              <TableCell>Inspiring Leadership</TableCell>
              <TableCell>C+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Biv Bodhrik</TableCell>
              <TableCell>Overwhelming Oppression</TableCell>
              <TableCell>C+</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>

      <Grid size={{ xs: 12, sm: 7 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Deployment</TableCell>
              <TableCell aria-label="Regular">⬜️</TableCell>
              <TableCell aria-label="Elite">🟥</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>🔫</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deploymentCards.map((card, i) =>
              card.divider ? (
                <TableRow key={i} selected>
                  <TableCell colSpan={5} align="center">
                    {card.name}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={i}>
                  <TableCell>{card.name}</TableCell>
                  <TableCell>{card.reg}</TableCell>
                  <TableCell>{card.elite}</TableCell>
                  <TableCell>{card.cost}</TableCell>
                  <TableCell>{card.bh && "🔫"}</TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  </ExpandableCard>
);

export default TierLists;

import * as React from "react";
import Grid from "@mui/material/Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import ExpandableCard from "../../common/expandable-card";

interface DeploymentCards {
  name: string;
  elite?: boolean;
  cost: string;
  hunter?: boolean;
  rank: string;
}

const deploymentCards: DeploymentCards[] = [
  { name: "Nexu", cost: "4", hunter: true, rank: "S" },
  { name: "Hired Gun", cost: "4/2", hunter: true, rank: "S" },

  { name: "Sentry Droid", elite: true, cost: "10/5", rank: "A" },
  { name: "Riot Trooper", elite: true, cost: "7/3", rank: "A" },
  { name: "Jet Trooper", elite: true, cost: "7/4", rank: "A" },
  { name: "Loth-cat", elite: true, cost: "6/3", hunter: true, rank: "A" },
  { name: "Dewback Rider", elite: true, cost: "5", rank: "A" },
  { name: "AT-DP", elite: true, cost: "9", rank: "A" },
  { name: "Death Trooper", cost: "3", rank: "A" },
  { name: "Death Trooper", elite: true, cost: "4", rank: "A" },
  { name: "Stormtrooper", elite: true, cost: "9/3", rank: "A" },
  { name: "Nexu", elite: true, cost: "6", rank: "A" },
  { name: "Trandoshan Hunter", cost: "7/3", hunter: true, rank: "A" },
  { name: "Hired Gun", elite: true, cost: "6/3", hunter: true, rank: "A" },
  { name: "Jawa Scavenger", cost: "2", hunter: true, rank: "A" },
  { name: "Jawa Scavenger", elite: true, cost: "3", hunter: true, rank: "A" },
  { name: "Riot Trooper", cost: "5/2", rank: "A" },
  {
    name: "Gamorrean Guard",
    elite: true,
    cost: "8/4",
    hunter: true,
    rank: "A",
  },
  { name: "Heavy Stormtrooper", elite: true, cost: "8/4", rank: "A" },

  { name: "Royal Guard", cost: "8/4", rank: "B" },
  { name: "Loth-cat", cost: "4/2", hunter: true, rank: "B" },
  { name: "Jet Trooper", cost: "4/2", rank: "B" },
  { name: "Weequay Pirate", elite: true, cost: "7/4", hunter: true, rank: "B" },
  { name: "ISB Infiltrator", elite: true, cost: "7/4", rank: "B" },
  { name: "Stormtrooper", cost: "6/2", rank: "B" },
  { name: "Probe Droid", elite: true, cost: "5", rank: "B" },
  { name: "Weequay Pirate", cost: "5/3", hunter: true, rank: "B" },
  {
    name: "Ugnaught Tinkerer",
    elite: true,
    cost: "5",
    hunter: true,
    rank: "B",
  },
  { name: "HK Assassin Droid", cost: "8/4", hunter: true, rank: "B" },
  { name: "Wing Guard", elite: true, cost: "9/3", hunter: true, rank: "B" },
  {
    name: "Clawdite Shapeshifter",
    elite: true,
    cost: "6",
    hunter: true,
    rank: "B",
  },
  { name: "SC2-M Repulsor Tank", elite: true, cost: "10", rank: "B" },
  { name: "E-Web Engineer", elite: true, cost: "8", rank: "B" },

  { name: "Probe Droid", cost: "3", rank: "C" },
  { name: "Sentry Droid", cost: "6/3", rank: "C" },
  { name: "Heavy Stormtrooper", cost: "6/3", rank: "C" },
  { name: "Wing Guard", cost: "6/2", hunter: true, rank: "C" },
  { name: "ISB Infiltrator", cost: "5/3", rank: "C" },
  { name: "Royal Guard", elite: true, cost: "12/6", rank: "C" },
  {
    name: "Trandoshan Hunter",
    elite: true,
    cost: "10/5",
    hunter: true,
    rank: "C",
  },
  { name: "Tusken Raider", elite: true, cost: "7/3", hunter: true, rank: "C" },
  { name: "Ugnaught Tinkerer", cost: "3", hunter: true, rank: "C" },
  { name: "Imperial Officer", cost: "2", rank: "C" },
  { name: "Bantha Rider", elite: true, cost: "9", hunter: true, rank: "C" },
  { name: "Clawdite Shapeshifter", cost: "4", hunter: true, rank: "C" },
  { name: "Rancor", elite: true, cost: "10", hunter: true, rank: "C" },
  { name: "Snowtrooper", cost: "7/2", rank: "C" },
  { name: "E-Web Engineer", cost: "6", rank: "C" },

  { name: "Wampa", elite: true, cost: "8", hunter: true, rank: "D" },
  { name: "Imperial Officer", elite: true, cost: "5", rank: "D" },
  { name: "Tusken Raider", cost: "5/2", hunter: true, rank: "D" },
  { name: "Wampa", cost: "5", hunter: true, rank: "D" },
  {
    name: "HK Assassin Droid",
    elite: true,
    cost: "11/6",
    hunter: true,
    rank: "D",
  },
  { name: "Snowtrooper", elite: true, cost: "10/3", rank: "D" },
  { name: "Gamorrean Guard", cost: "6/3", hunter: true, rank: "D" },
  { name: "AT-ST", elite: true, cost: "14", rank: "D" },
];

const TierLists = () => (
  <ExpandableCard title="Tier Lists">
    <Grid container spacing={2} size={12}>
      <Grid size={{ xs: 6, sm: 4 }}>
        <Typography variant="h3" gutterBottom>
          Rebel Heroes
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hero</TableCell>
              <TableCell>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} align="center">
                S-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gideon Argus</TableCell>
              <TableCell>S+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fenn Signis</TableCell>
              <TableCell>S</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Diala Passil</TableCell>
              <TableCell>S</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Shyla Varad</TableCell>
              <TableCell>S</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Vinto Hreeda</TableCell>
              <TableCell>S-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                A-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mak Eshka&apos;rey</TableCell>
              <TableCell>A+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Drokkatta</TableCell>
              <TableCell>A+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Varena Talos</TableCell>
              <TableCell>A+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gaarkhan</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jyn Odan</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>MDH-19</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ko-Tun Feralo</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Onar Koma</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Murne Rin</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jarrod Kelvin</TableCell>
              <TableCell>A-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Davith Elso</TableCell>
              <TableCell>A-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                B-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Loku Kanoloa</TableCell>
              <TableCell>B+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                C-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Saska Teft</TableCell>
              <TableCell>C+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Biv Bodhrik</TableCell>
              <TableCell>C+</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>

      <Grid size={{ xs: 6, sm: 4 }}>
        <Typography variant="h3" gutterBottom>
          Imperial Classes
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Decks</TableCell>
              <TableCell>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} align="center">
                S-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Subversive Tactics</TableCell>
              <TableCell>S+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Military Might</TableCell>
              <TableCell>S</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hutt Mercenaries</TableCell>
              <TableCell>S</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                A-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tech Superiority</TableCell>
              <TableCell>A+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Nemeses</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Power of the Dark Side</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                B-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Imperial Black Ops</TableCell>
              <TableCell>B+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Armored Onslaught</TableCell>
              <TableCell>B</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Reactive Defenses</TableCell>
              <TableCell>B</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Precision Training</TableCell>
              <TableCell>B</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                C-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Inspiring Leadership</TableCell>
              <TableCell>C</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Overwhelming Oppression</TableCell>
              <TableCell>C</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Typography variant="h3" gutterBottom>
          Deployments
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>🥊 🔫</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deploymentCards.map((card, i) => (
              <React.Fragment key={i}>
                {card.rank !== deploymentCards[i - 1]?.rank && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      {card.rank}-Tier
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell>
                    {card.elite && "🥊"}
                    {card.hunter && " 🔫"}
                  </TableCell>
                  <TableCell>{card.name}</TableCell>
                  <TableCell>{card.cost}</TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  </ExpandableCard>
);

export default TierLists;

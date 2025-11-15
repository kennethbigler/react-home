import ExpandableCard from "../../common/expandable-card";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

interface DeploymentCards {
  name: string;
  reg?: string;
  elite?: string;
  divider?: boolean;
}

const deploymentCards: DeploymentCards[] = [
  { name: "S-Tier", divider: true },
  { name: "Nexu", reg: "S+", elite: "A" },
  { name: "Hired Gun", reg: "S", elite: "A" },

  { name: "A-Tier", divider: true },
  { name: "Sentry Droid", reg: "C+", elite: "A+" },
  { name: "Riot Trooper", reg: "A-", elite: "A+" },
  { name: "Jet Trooper", reg: "B+", elite: "A+" },
  { name: "Loth-cat", reg: "B+", elite: "A+" },
  { name: "Dewback Rider", reg: "-", elite: "A+" },
  { name: "AT-DP", reg: "-", elite: "A+" },
  { name: "Death Trooper", reg: "A", elite: "A" },
  { name: "Stormtrooper", reg: "B", elite: "A" },
  { name: "Trandoshan Hunter", reg: "A", elite: "C" },
  { name: "Jawa Scavenger", reg: "A-", elite: "A-" },
  { name: "Gamorrean Guard", reg: "D-", elite: "A-" },
  { name: "Heavy Stormtrooper", reg: "C+", elite: "A-" },

  { name: "B-Tier", divider: true },
  { name: "Royal Guard", reg: "B+", elite: "C" },
  { name: "Weequay Pirate", reg: "B", elite: "B+" },
  { name: "ISB Infiltrator", reg: "C+", elite: "B+" },
  { name: "Probe Droid", reg: "C+", elite: "B" },
  { name: "Ugnaught Tinkerer", reg: "C", elite: "B" },
  { name: "HK Assassin Droid", reg: "B", elite: "D" },
  { name: "Wing Guard", reg: "C+", elite: "B-" },
  { name: "Clawdite Shapeshifter", reg: "C-", elite: "B-" },
  { name: "SC2-M Repulsor Tank", reg: "-", elite: "B-" },
  { name: "E-Web Engineer", reg: "C-", elite: "B-" },

  { name: "C-Tier", divider: true },
  { name: "Tusken Raider", reg: "D+", elite: "C" },
  { name: "Imperial Officer", reg: "C", elite: "D+" },
  { name: "Bantha Rider", reg: "-", elite: "C-" },
  { name: "Rancor", reg: "-", elite: "C-" },
  { name: "Snowtrooper", reg: "C-", elite: "D" },

  { name: "D-Tier", divider: true },
  { name: "Wampa", reg: "D", elite: "D+" },
  { name: "AT-ST", reg: "-", elite: "D-" },
];

const TierLists = () => (
  <ExpandableCard title="Tier Lists">
    <Grid container spacing={4} size={12}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rebel Hero</TableCell>
              <TableCell>Imperial Class Deck</TableCell>
              <TableCell>Agenda Card Sets</TableCell>
              <TableCell>Rank</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow selected>
              <TableCell colSpan={4} align="center">
                S-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gideon Argus</TableCell>
              <TableCell>Subversive Tactics</TableCell>
              <TableCell>Crimson Empire</TableCell>
              <TableCell>S+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fenn Signis</TableCell>
              <TableCell>Military Might</TableCell>
              <TableCell>For the Right Price</TableCell>
              <TableCell>S</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Diala Passil</TableCell>
              <TableCell>Hutt Mercenaries</TableCell>
              <TableCell>Imperial Discipline</TableCell>
              <TableCell>S</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Shyla Varad</TableCell>
              <TableCell></TableCell>
              <TableCell>Imperial Industry</TableCell>
              <TableCell>S</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Vinto Hreeda</TableCell>
              <TableCell></TableCell>
              <TableCell>Retaliation</TableCell>
              <TableCell>S-</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell colSpan={4} align="center">
                A-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mak Eshka&apos;rey</TableCell>
              <TableCell>Reactive Defenses</TableCell>
              <TableCell>Nefarious Dealings</TableCell>
              <TableCell>A+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Drokkatta</TableCell>
              <TableCell>Tech Superiority</TableCell>
              <TableCell>Weapons Division</TableCell>
              <TableCell>A+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Varena Talos</TableCell>
              <TableCell></TableCell>
              <TableCell>Defensive Tactics</TableCell>
              <TableCell>A+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gaarkhan</TableCell>
              <TableCell>Nemeses</TableCell>
              <TableCell>The Empire&apos;s Reach</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jyn Odan</TableCell>
              <TableCell>Power of the Dark Side</TableCell>
              <TableCell>Enhanced Interrogation</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>MDH-19</TableCell>
              <TableCell></TableCell>
              <TableCell>Natural Warfare</TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ko-Tun Feralo</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Onar Koma</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Murne Rin</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jarrod Kelvin</TableCell>
              <TableCell>Imperial Black Ops</TableCell>
              <TableCell></TableCell>
              <TableCell>A-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Davith Elso</TableCell>
              <TableCell>Precision Training</TableCell>
              <TableCell></TableCell>
              <TableCell>A-</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell colSpan={4} align="center">
                B-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Loku Kanoloa</TableCell>
              <TableCell>Armored Onslaught</TableCell>
              <TableCell></TableCell>
              <TableCell>B+</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell colSpan={4} align="center">
                C-Tier
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Saska Teft</TableCell>
              <TableCell>Inspiring Leadership</TableCell>
              <TableCell></TableCell>
              <TableCell>C+</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Biv Bodhrik</TableCell>
              <TableCell>Overwhelming Oppression</TableCell>
              <TableCell></TableCell>
              <TableCell>C+</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Deployment</TableCell>
              <TableCell>Regular</TableCell>
              <TableCell>Elite</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deploymentCards.map((card, i) =>
              card.divider ? (
                <TableRow key={i} selected>
                  <TableCell colSpan={3} align="center">
                    {card.name}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={i}>
                  <TableCell>{card.name}</TableCell>
                  <TableCell>{card.reg}</TableCell>
                  <TableCell>{card.elite}</TableCell>
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

import Typography from "@mui/material/Typography";
import StarBorder from "@mui/icons-material/StarBorder";
import Star from "@mui/icons-material/Star";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

const threat = 3;
const isStory = false;

const ImperialAssault = () => (
  <>
    <Typography variant="h2" component="h1" gutterBottom>
      Imperial Assault
    </Typography>
    <Typography>Rebels</Typography>
    <ul>
      <li>XP trackers for 4 players, ranges from 1-6?</li>
      <li>Rebel Credit Tracker</li>
    </ul>
    <Typography>Empire</Typography>
    <ul>
      <li>Empire XP Tracker</li>
      <li>Empire Influence Tracker</li>
    </ul>
    <Typography>Missions</Typography>
    <ul>
      <li>
        <TextField
          label={`${isStory ? "Story" : "Side"} Mission`}
          variant="outlined"
        />
      </li>
      <li>
        <Chip avatar={<Avatar>{threat}</Avatar>} label="Threat" />
        <Checkbox
          inputProps={{ "aria-label": "Completed Mission" }}
          icon={<StarBorder />}
          checkedIcon={<Star />}
        />
      </li>
      <li>
        <span>Skip on Finale - Display: Rebel `Tier X Items, Spend XP`</span>
        <Checkbox
          inputProps={{ "aria-label": "Rebels shopped" }}
          icon={<StarBorder />}
          checkedIcon={<Star />}
        />
      </li>
      <li>
        <span>
          Skip on Finale - Display: Empire &quot;Agenda, Spend XP&quot;
        </span>
        <Checkbox
          inputProps={{ "aria-label": "Empire shopped" }}
          icon={<StarBorder />}
          checkedIcon={<Star />}
        />
      </li>
    </ul>
    <Typography>Forced Missions</Typography>
    <ul>
      <li>Display: Story vs Side / Input: Textfield - Name</li>
      <li>
        Populate & save Threat level from most recent Mission / Input: Checkbox
        - Complete?
      </li>
    </ul>
  </>
);

export default ImperialAssault;

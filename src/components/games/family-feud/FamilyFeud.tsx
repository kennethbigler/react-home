import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../../common/tab-panel/tab-panel";
import a11yProps from "../../common/tab-panel/tab-panel-helper";
import TeamDisplay from "./TeamsDisplay";
import GameRound from "./GameRound";
import FastMoney from "./FastMoney";
import { Typography } from "@mui/material";

const FamilyFeud = () => {
  const [value, setValue] = React.useState(0);
  const [score1, setScore1] = React.useState(0);
  const [score2, setScore2] = React.useState(0);

  const handleChange = (
    _: React.SyntheticEvent<Element, Event>,
    tabValue: number,
  ) => {
    setValue(tabValue);
  };

  const handleScore1 = (score: number) => {
    setScore1(score1 + score);
  };

  const handleScore2 = (score: number) => {
    setScore2(score2 + score);
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        Family Feud!
      </Typography>
      <TeamDisplay score1={score1} score2={score2} />
      <br />
      <Tabs
        value={value}
        indicatorColor="secondary"
        textColor="secondary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Round 1" {...a11yProps(0)} />
        <Tab label="Round 2" {...a11yProps(1)} />
        <Tab label="Round 3" {...a11yProps(2)} />
        <Tab label="Round 4" {...a11yProps(3)} />
        <Tab label="Sudden Death" {...a11yProps(4)} />
        <Tab label="Fast Money" {...a11yProps(5)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <GameRound
          question="Name the silliest item you left at your desk from pre-covid. if you joined after March 2020, name the silliest item you think someone else left."
          answers={[
            "Food/Drink",
            "Desk Animal",
            "Electronic Accessory",
            "Badge",
            "Laptop",
          ]}
          scores={[48, 22, 14, 7, 7]}
          onScore1={handleScore1}
          onScore2={handleScore2}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GameRound
          question="Name a superpower that would give you an advantage in an easter egg hunt."
          answers={[
            "Xray/Special Vision",
            "Speed",
            "Egg Finder",
            "Time Control",
            "Flight",
            "Mind Reading",
          ]}
          scores={[46, 21, 9, 9, 6, 6]}
          onScore1={handleScore1}
          onScore2={handleScore2}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GameRound
          question="Name something you would never leave home without."
          answers={[
            "Phone",
            "Clothes/Jacket/Shoes/Glasses",
            "Keys",
            "Wallet",
            "Water Bottle",
          ]}
          scores={[45, 28, 11, 8, 5]}
          onScore1={handleScore1}
          onScore2={handleScore2}
          modifier={2}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <GameRound
          question="Name something you want to do on the first warm day of spring."
          answers={[
            "Walk/Hike",
            "Go to the Park",
            "Picnic",
            "Cool Off",
            "Swim",
            "Wear Shorts/Flip Flops",
          ]}
          scores={[43, 18, 12, 9, 9, 6]}
          onScore1={handleScore1}
          onScore2={handleScore2}
          modifier={3}
        />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <GameRound
          question="Name something you could not get through the workday without."
          answers={["Coffee", "Laptop", "Water", "Headphones", "Tea", "Slack"]}
          scores={[37, 20, 14, 11, 11, 5]}
          onScore1={handleScore1}
          onScore2={handleScore2}
          modifier={300}
        />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <FastMoney
          questions={[
            "Besides chickens, name something else that hatches from an egg.",
            "Name a word or phrase that includes the word basket.",
            "Name a flower often seen in the spring.",
            "Name something you keep in your car, just in case.",
            "Name a word that rhymes with the word “shower”.",
          ]}
          answers={[
            [
              "Reptiles",
              "Duck",
              "Ostrich",
              "Bird",
              "Platypus",
              "Dinosaurs",
              "Fish",
              "Dragon",
            ],
            [
              "Basketball",
              "Basket Case",
              "Fruit Basket",
              "Don't put all your eggs in one basket",
              "Hand Basket",
              "Gift Basket",
            ],
            [
              "Tulip",
              "CA Poppy",
              "Cherry Blossom",
              "Daffodil",
              "Daisy",
              "Sun Flower",
            ],
            [
              "Jumper Cables/Tools",
              "Masks",
              "Food/Water",
              "Sanitizer/Wipes",
              "Sunglasses",
              "Umbrella",
              "Cash",
              "First Aid Kit",
            ],
            ["Flower", "Power", "Cower", "Tower", "Bower", "Hour"],
          ]}
          scores={[
            [35, 15, 12, 10, 7, 7, 5, 5],
            [47, 20, 14, 8, 5, 2],
            [48, 13, 10, 10, 10, 6],
            [21, 18, 15, 12, 9, 9, 6, 6],
            [36, 33, 9, 9, 6, 6],
          ]}
        />
      </TabPanel>
    </>
  );
};

export default FamilyFeud;

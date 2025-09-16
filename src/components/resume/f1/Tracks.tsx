import * as React from "react";
import Grid from "@mui/material/Grid";
import australiaSrc from "../../../images/tracks/Australia_Circuit.avif";
import chinaSrc from "../../../images/tracks/China_Circuit.avif";
import japanSrc from "../../../images/tracks/Japan_Circuit.avif";
import bahrainSrc from "../../../images/tracks/Bahrain_Circuit.avif";
import saudiSrc from "../../../images/tracks/Saudi_Arabia_Circuit.avif";
import miamiSrc from "../../../images/tracks/Miami_Circuit.avif";
import emiliaSrc from "../../../images/tracks/Emilia_Romagna_Circuit.avif";
import monacoSrc from "../../../images/tracks/Monaco_Circuit.avif";
import spainSrc from "../../../images/tracks/Spain_Circuit.avif";
import canadaSrc from "../../../images/tracks/Canada_Circuit.avif";
import austriaSrc from "../../../images/tracks/Austria_Circuit.avif";
import gbSrc from "../../../images/tracks/Great_Britain_Circuit.avif";
import belgiumSrc from "../../../images/tracks/Belgium_Circuit.avif";
import hungarySrc from "../../../images/tracks/Hungary_Circuit.avif";
import netherlandsSrc from "../../../images/tracks/Netherlands_Circuit.avif";
import italySrc from "../../../images/tracks/Italy_Circuit.avif";
import bakuSrc from "../../../images/tracks/Baku_Circuit.avif";
import singaporeSrc from "../../../images/tracks/Singapore_Circuit.avif";
import usaSrc from "../../../images/tracks/USA_Circuit.avif";
import mexicoSrc from "../../../images/tracks/Mexico_Circuit.avif";
import brazilSrc from "../../../images/tracks/Brazil_Circuit.avif";
import lasVegasSrc from "../../../images/tracks/Las_Vegas_Circuit.avif";
import qatarSrc from "../../../images/tracks/Qatar_Circuit.avif";
import abuDhabiSrc from "../../../images/tracks/Abu_Dhabi_Circuit.avif";
import franceSrc from "../../../images/tracks/France_Circuit.avif";
import portugalSrc from "../../../images/tracks/Portugal_Circuit.avif";
import russiaSrc from "../../../images/tracks/Russia_Circuit.avif";
import turkeySrc from "../../../images/tracks/Turkey_Circuit.avif";
import tuscanySrc from "../../../images/tracks/Tuscany_Circuit.avif";
import germanySrc from "../../../images/tracks/Germany_Circuit.avif";
import germanyHSrc from "../../../images/tracks/Germany_Circuit_Hockenheim.avif";
import Track from "./Track";
import ExpandableCard from "../../common/expandable-card";
import { FERRARI_HEX } from "../../../constants/f1";

const Tracks = React.memo(() => {
  const [expanded, setExpanded] = React.useState("");

  const toggleExpanded = (circuitName: string) => () => {
    setExpanded(circuitName === expanded ? "" : circuitName);
  };

  // TODO: Update track fastLapTime from Azerbaijan onward for 2025
  // TODO: Update track title from 2025 to 2026
  // TODO: remove Imola for 2026
  // TODO: Add Madrid for 2026

  return (
    <>
      <ExpandableCard title="2025 Tracks" backgroundColor={FERRARI_HEX}>
        <Grid container spacing={3} width="100%">
          <Track
            expanded={expanded}
            circuitName="Albert Park Circuit, Melbourne, Australia"
            imgSrc={australiaSrc}
            circuitLen={5.278}
            firstGP={1996}
            numLaps={58}
            fastLapTime="1:19.813"
            fastLapDriver="Charles Leclerc (2024)"
            raceLen={306.124}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Shanghai International Circuit, China"
            imgSrc={chinaSrc}
            circuitLen={5.451}
            firstGP={2004}
            numLaps={56}
            fastLapTime="1:34.742"
            fastLapDriver="Pierre Gasly (2019)"
            raceLen={305.066}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Suzuka Circuit, Japan"
            imgSrc={japanSrc}
            circuitLen={5.807}
            firstGP={1987}
            numLaps={53}
            fastLapTime="1:30.965"
            fastLapDriver="Kimi Antonelli (2025)"
            raceLen={307.471}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Bahrain International Circuit, Sakhir"
            imgSrc={bahrainSrc}
            circuitLen={5.412}
            firstGP={2004}
            numLaps={57}
            fastLapTime="1:32.014"
            fastLapDriver="Max Verstappen (2020)"
            raceLen={308.238}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Saudi Arabia Circuit, Jeddah"
            imgSrc={saudiSrc}
            circuitLen={6.174}
            firstGP={2021}
            numLaps={50}
            fastLapTime="1:30.734"
            fastLapDriver="Lewis Hamilton (2021)"
            raceLen={308.45}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Miami International Autodrome, USA"
            imgSrc={miamiSrc}
            circuitLen={5.412}
            firstGP={2021}
            numLaps={57}
            fastLapTime="1:29.708"
            fastLapDriver="Max Verstappen (2023)"
            raceLen={308.326}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Imola, Emilia-Romagna, Italy - 2025"
            circuitSubName="Autodromo Internazionale Enzo e Dino Ferrari"
            imgSrc={emiliaSrc}
            circuitLen={4.909}
            firstGP={1980}
            numLaps={63}
            fastLapTime="1:15.484"
            fastLapDriver="Lewis Hamilton (2020)"
            raceLen={309.049}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Circuit de Monaco"
            imgSrc={monacoSrc}
            circuitLen={3.337}
            firstGP={1950}
            numLaps={78}
            fastLapTime="1:12.909"
            fastLapDriver="Lewis Hamilton (2021)"
            raceLen={260.286}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Circuit de Barcelona-Catalunya, Spain"
            imgSrc={spainSrc}
            circuitLen={4.361}
            firstGP={1978}
            numLaps={70}
            fastLapTime="1:13.078"
            fastLapDriver="Valtteri Bottas (2019)"
            raceLen={305.27}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Circuit Gilles-Villeneuve, Montreal, Canada"
            imgSrc={canadaSrc}
            circuitLen={4.361}
            firstGP={1978}
            numLaps={70}
            fastLapTime="1:13.078"
            fastLapDriver="Valtteri Bottas (2019)"
            raceLen={305.27}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Red Bull Ring, Spielberg, Austria"
            imgSrc={austriaSrc}
            circuitLen={4.326}
            firstGP={1970}
            numLaps={71}
            fastLapTime="1:07.924"
            fastLapDriver="Oscar Piastri (2025)"
            raceLen={307.018}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Silverstone Circuit, Great Britain"
            imgSrc={gbSrc}
            circuitLen={5.891}
            firstGP={1950}
            numLaps={52}
            fastLapTime="1:27.097"
            fastLapDriver="Max Verstappen (2020)"
            raceLen={306.198}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Circuit de Spa-Francorchamps, Belgium"
            imgSrc={belgiumSrc}
            circuitLen={7.004}
            firstGP={1950}
            numLaps={44}
            fastLapTime="1:44.701"
            fastLapDriver="Sergio Perez (2024)"
            raceLen={308.052}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Hungaroring, Budapest, Hungary"
            imgSrc={hungarySrc}
            circuitLen={4.381}
            firstGP={1986}
            numLaps={70}
            fastLapTime="1:16.627"
            fastLapDriver="Lewis Hamilton (2020)"
            raceLen={306.63}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Circuit Zandvoort, Netherlands"
            imgSrc={netherlandsSrc}
            circuitLen={4.259}
            firstGP={1952}
            numLaps={72}
            fastLapTime="1:11.097"
            fastLapDriver="Lewis Hamilton (2021)"
            raceLen={306.587}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Autodromo Nazionale Monza, Italy"
            imgSrc={italySrc}
            circuitLen={5.793}
            firstGP={1950}
            numLaps={53}
            fastLapTime="1:20.901"
            fastLapDriver="Lando Norris (2025)"
            raceLen={306.72}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Baku City Circuit, Azerbaijan"
            imgSrc={bakuSrc}
            circuitLen={6.003}
            firstGP={2016}
            numLaps={51}
            fastLapTime="1:43.009"
            fastLapDriver="Charles Leclerc (2019)"
            raceLen={306.049}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Marina Bay Street Circuit, Singapore"
            imgSrc={singaporeSrc}
            circuitLen={4.94}
            firstGP={2008}
            numLaps={62}
            fastLapTime="1:34.486"
            fastLapDriver="Daniel Ricciardo (2024)"
            raceLen={306.143}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Circuit of The Americas, Austin, USA"
            imgSrc={usaSrc}
            circuitLen={5.513}
            firstGP={2012}
            numLaps={56}
            fastLapTime="1:36.169"
            fastLapDriver="Charles Leclerc (2019)"
            raceLen={308.405}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Autódromo Hermanos Rodríguez, Mexico City, Mexico"
            imgSrc={mexicoSrc}
            circuitLen={4.304}
            firstGP={1963}
            numLaps={71}
            fastLapTime="1:17.774"
            fastLapDriver="Valtteri Bottas (2021)"
            raceLen={305.354}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Interlagos, São Paulo, Brazil"
            circuitSubName="Autodromo Jose Carlos Pace"
            imgSrc={brazilSrc}
            circuitLen={4.309}
            firstGP={1973}
            numLaps={71}
            fastLapTime="1:11.010"
            fastLapDriver="Sergio Perez (2021)"
            raceLen={305.879}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Las Vegas Strip Circuit, USA"
            imgSrc={lasVegasSrc}
            circuitLen={6.201}
            firstGP={2023}
            numLaps={50}
            fastLapTime="1:34.876"
            fastLapDriver="Lando Norris (2024)"
            raceLen={309.958}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Lusail International Circuit, Doha, Qatar"
            imgSrc={qatarSrc}
            circuitLen={5.419}
            firstGP={2021}
            numLaps={57}
            fastLapTime="1:22.384"
            fastLapDriver="Lando Norris (2024)"
            raceLen={308.611}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Yas Marina Circuit, Abu Dhabi"
            imgSrc={abuDhabiSrc}
            circuitLen={5.281}
            firstGP={2009}
            numLaps={58}
            fastLapTime="1:25.637"
            fastLapDriver="Kevin Magnussen (2024)"
            raceLen={306.183}
            onClick={toggleExpanded}
          />
        </Grid>
      </ExpandableCard>
      <ExpandableCard title="Past Tracks" backgroundColor={FERRARI_HEX}>
        <Grid container spacing={3} width="100%">
          <Track
            expanded={expanded}
            circuitName="Circuit Paul Ricard, France, 2022"
            imgSrc={franceSrc}
            circuitLen={5.842}
            firstGP={1971}
            numLaps={53}
            fastLapTime="1:32.740"
            fastLapDriver="Sebastian Vettel (2019)"
            raceLen={309.69}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Portimao, Portugal, 2021"
            circuitSubName="Autodromo Internacional do Algarve"
            imgSrc={portugalSrc}
            circuitLen={4.653}
            firstGP={2020}
            numLaps={66}
            fastLapTime="1:18.750"
            fastLapDriver="Lewis Hamilton (2020)"
            raceLen={306.826}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Sochi Autodrom, Russia, 2021"
            imgSrc={russiaSrc}
            circuitLen={5.848}
            firstGP={2014}
            numLaps={53}
            fastLapTime="1:35.761"
            fastLapDriver="Lewis Hamilton (2019)"
            raceLen={309.745}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Turkish Circuit, Akfirat, Turkey, 2021"
            imgSrc={turkeySrc}
            circuitLen={5.338}
            firstGP={2005}
            numLaps={58}
            fastLapTime="1:24.770"
            fastLapDriver="Juan Pablo Montoya (2005)"
            raceLen={309.396}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Mugello Circuit, Tuscany, Italy, 2020"
            imgSrc={tuscanySrc}
            circuitLen={5.245}
            firstGP={2020}
            numLaps={59}
            fastLapTime="1:18.833"
            fastLapDriver="Lewis Hamilton (2020)"
            raceLen={309.497}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Nurburgring, Germany, 2020"
            imgSrc={germanySrc}
            circuitLen={5.148}
            firstGP={1951}
            numLaps={60}
            fastLapTime="1:28.139"
            fastLapDriver="Max Verstappen (2020)"
            raceLen={308.617}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Hockenheim, Germany, 2019"
            imgSrc={germanyHSrc}
            circuitLen={4.574}
            firstGP={1970}
            numLaps={67}
            fastLapTime="1:13.780"
            fastLapDriver="Kimi Räikkönen (2004)"
            raceLen={306.458}
            onClick={toggleExpanded}
          />
        </Grid>
      </ExpandableCard>
    </>
  );
});

Tracks.displayName = "Tracks";

export default Tracks;

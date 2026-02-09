import { memo, useState } from "react";
import { Grid } from "@mui/material";
import australiaSrc from "../../../images/tracks/Australia_Circuit.avif";
import chinaSrc from "../../../images/tracks/China_Circuit.avif";
import japanSrc from "../../../images/tracks/Japan_Circuit.avif";
import bahrainSrc from "../../../images/tracks/Bahrain_Circuit.avif";
import saudiSrc from "../../../images/tracks/Saudi_Arabia_Circuit.avif";
import miamiSrc from "../../../images/tracks/Miami_Circuit.avif";
import emiliaSrc from "../../../images/tracks/Emilia_Romagna_Circuit.avif";
import monacoSrc from "../../../images/tracks/Monaco_Circuit.avif";
import barcelonaSrc from "../../../images/tracks/Barcelona_Circuit.avif";
import canadaSrc from "../../../images/tracks/Canada_Circuit.avif";
import austriaSrc from "../../../images/tracks/Austria_Circuit.avif";
import gbSrc from "../../../images/tracks/Great_Britain_Circuit.avif";
import belgiumSrc from "../../../images/tracks/Belgium_Circuit.avif";
import hungarySrc from "../../../images/tracks/Hungary_Circuit.avif";
import netherlandsSrc from "../../../images/tracks/Netherlands_Circuit.avif";
import italySrc from "../../../images/tracks/Italy_Circuit.avif";
import madridSrc from "../../../images/tracks/Madrid_Circuit.avif";
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

const Tracks = memo(() => {
  const [expanded, setExpanded] = useState("");

  const toggleExpanded = (circuitName: string) => () => {
    setExpanded(circuitName === expanded ? "" : circuitName);
  };

  return (
    <>
      <ExpandableCard title="2026 Tracks" backgroundColor={FERRARI_HEX}>
        <Grid container spacing={3} width="100%">
          <Track
            expanded={expanded}
            circuitName="Albert Park Circuit, Melbourne, Australia"
            imgSrc={australiaSrc}
            circuitLen={5.278}
            firstGP={1996}
            numLaps={58}
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
            raceLen={308.326}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Circuit Gilles-Villeneuve, Montreal, Canada"
            imgSrc={canadaSrc}
            circuitLen={4.361}
            firstGP={1978}
            numLaps={70}
            raceLen={305.27}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Circuit de Monaco"
            imgSrc={monacoSrc}
            circuitLen={3.337}
            firstGP={1950}
            numLaps={78}
            raceLen={260.286}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Circuit de Barcelona-Catalunya, Spain"
            imgSrc={barcelonaSrc}
            circuitLen={4.361}
            firstGP={1978}
            numLaps={70}
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
            raceLen={306.72}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Madring, Madrid, Spain"
            imgSrc={madridSrc}
            circuitLen={0}
            firstGP={2026}
            numLaps={0}
            raceLen={0}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Baku City Circuit, Azerbaijan"
            imgSrc={bakuSrc}
            circuitLen={6.003}
            firstGP={2016}
            numLaps={51}
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
            raceLen={308.611}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Yas Marina Circuit, Abu Dhabi, UAE"
            imgSrc={abuDhabiSrc}
            circuitLen={5.281}
            firstGP={2009}
            numLaps={58}
            raceLen={306.183}
            onClick={toggleExpanded}
          />
        </Grid>
      </ExpandableCard>
      <ExpandableCard title="Past Tracks" backgroundColor={FERRARI_HEX}>
        <Grid container spacing={3} width="100%">
          <Track
            expanded={expanded}
            circuitName="Imola, Emilia-Romagna, Italy - 2025"
            circuitSubName="Autodromo Internazionale Enzo e Dino Ferrari"
            imgSrc={emiliaSrc}
            circuitLen={4.909}
            firstGP={1980}
            numLaps={63}
            raceLen={309.049}
            onClick={toggleExpanded}
          />
          <Track
            expanded={expanded}
            circuitName="Circuit Paul Ricard, France, 2022"
            imgSrc={franceSrc}
            circuitLen={5.842}
            firstGP={1971}
            numLaps={53}
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

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
import Track from "./Track";

// TODO: maybe add on click to expand the track to 12? Or add way to choose size

const Tracks = () => (
  <Grid container spacing={3} width="100%">
    <Track
      circuitName="Albert Park Circuit, Melbourne, Australia"
      imgSrc={australiaSrc}
      circuitLen={5.278}
      firstGP={1996}
      numLaps={58}
      fastLapTime="1:19.813"
      fastLapDriver="Charles Leclerc (2024)"
      raceLen={306.124}
    />
    <Track
      circuitName="Shanghai International Circuit, China"
      imgSrc={chinaSrc}
      circuitLen={5.451}
      firstGP={2004}
      numLaps={56}
      fastLapTime="1:34.742"
      fastLapDriver="Pierre Gasly (2019)"
      raceLen={305.066}
    />
    <Track
      circuitName="Suzuka Circuit, Japan"
      imgSrc={japanSrc}
      circuitLen={5.807}
      firstGP={1987}
      numLaps={53}
      fastLapTime="1:30.965"
      fastLapDriver="Kimi Antonelli (2025)"
      raceLen={307.471}
    />
    <Track
      circuitName="Bahrain International Circuit"
      imgSrc={bahrainSrc}
      circuitLen={5.412}
      firstGP={2004}
      numLaps={57}
      fastLapTime="1:32.014"
      fastLapDriver="Max Verstappen (2020)"
      raceLen={308.238}
    />
    <Track
      circuitName="Saudi Arabia Circuit"
      imgSrc={saudiSrc}
      circuitLen={6.174}
      firstGP={2021}
      numLaps={50}
      fastLapTime="1:30.734"
      fastLapDriver="Lewis Hamilton (2021)"
      raceLen={308.45}
    />
    <Track
      circuitName="Miami International Autodrome, USA"
      imgSrc={miamiSrc}
      circuitLen={5.412}
      firstGP={2021}
      numLaps={57}
      fastLapTime="1:29.708"
      fastLapDriver="Max Verstappen (2023)"
      raceLen={308.326}
    />
    <Track
      circuitName="Imola, Emilia-Romagna, Italy"
      circuitSubName="Autodromo Internazionale Enzo e Dino Ferrari"
      imgSrc={emiliaSrc}
      circuitLen={4.909}
      firstGP={1980}
      numLaps={63}
      fastLapTime="1:15.484"
      fastLapDriver="Lewis Hamilton (2020)"
      raceLen={309.049}
    />
    <Track
      circuitName="Circuit de Monaco"
      imgSrc={monacoSrc}
      circuitLen={3.337}
      firstGP={1950}
      numLaps={78}
      fastLapTime="1:12.909"
      fastLapDriver="Lewis Hamilton (2021)"
      raceLen={260.286}
    />
    <Track
      circuitName="Circuit de Barcelona-Catalunya, Spain"
      imgSrc={spainSrc}
      circuitLen={4.361}
      firstGP={1978}
      numLaps={70}
      fastLapTime="1:13.078"
      fastLapDriver="Valtteri Bottas (2019)"
      raceLen={305.27}
    />
    <Track
      circuitName="Circuit Gilles-Villeneuve, Montreal, Canada"
      imgSrc={canadaSrc}
      circuitLen={4.361}
      firstGP={1978}
      numLaps={70}
      fastLapTime="1:13.078"
      fastLapDriver="Valtteri Bottas (2019)"
      raceLen={305.27}
    />
    <Track
      circuitName="Red Bull Ring, Austria"
      imgSrc={austriaSrc}
      circuitLen={4.326}
      firstGP={1970}
      numLaps={71}
      fastLapTime="1:07.924"
      fastLapDriver="Oscar Piastri (2025)"
      raceLen={307.018}
    />
    <Track
      circuitName="Silverstone Circuit, Great Britain"
      imgSrc={gbSrc}
      circuitLen={5.891}
      firstGP={1950}
      numLaps={52}
      fastLapTime="1:27.097"
      fastLapDriver="Max Verstappen (2020)"
      raceLen={306.198}
    />
    <Track
      circuitName="Circuit de Spa-Francorchamps, Belgium"
      imgSrc={belgiumSrc}
      circuitLen={7.004}
      firstGP={1950}
      numLaps={44}
      fastLapTime="1:44.701"
      fastLapDriver="Sergio Perez (2024)"
      raceLen={308.052}
    />
    <Track
      circuitName="Hungaroring, Hungary"
      imgSrc={hungarySrc}
      circuitLen={4.381}
      firstGP={1986}
      numLaps={70}
      fastLapTime="1:16.627"
      fastLapDriver="Lewis Hamilton (2020)"
      raceLen={306.63}
    />
    <Track
      circuitName="Circuit Zandvoort, Netherlands"
      imgSrc={netherlandsSrc}
      circuitLen={4.259}
      firstGP={1952}
      numLaps={72}
      fastLapTime="1:11.097"
      fastLapDriver="Lewis Hamilton (2021)"
      raceLen={306.587}
    />
    <Track
      circuitName="Autodromo Nazionale Monza, Italy"
      imgSrc={italySrc}
      circuitLen={5.793}
      firstGP={1950}
      numLaps={53}
      fastLapTime="1:20.901"
      fastLapDriver="Lando Norris (2025)"
      raceLen={306.72}
    />
    <Track
      circuitName="Baku City Circuit, Azerbaijan"
      imgSrc={bakuSrc}
      circuitLen={6.003}
      firstGP={2016}
      numLaps={51}
      fastLapTime="1:43.009"
      fastLapDriver="Charles Leclerc (2019)"
      raceLen={306.049}
    />
    <Track
      circuitName="Marina Bay Street Circuit, Singapore"
      imgSrc={singaporeSrc}
      circuitLen={4.94}
      firstGP={2008}
      numLaps={62}
      fastLapTime="1:34.486"
      fastLapDriver="Daniel Ricciardo (2024)"
      raceLen={306.143}
    />
    <Track
      circuitName="Circuit of The Americas, Austin, USA"
      imgSrc={usaSrc}
      circuitLen={5.513}
      firstGP={2012}
      numLaps={56}
      fastLapTime="1:36.169"
      fastLapDriver="Charles Leclerc (2019)"
      raceLen={308.405}
    />
    <Track
      circuitName="Autódromo Hermanos Rodríguez, Mexico City, Mexico"
      imgSrc={mexicoSrc}
      circuitLen={4.304}
      firstGP={1963}
      numLaps={71}
      fastLapTime="1:17.774"
      fastLapDriver="Valtteri Bottas (2021)"
      raceLen={305.354}
    />
    <Track
      circuitName="Interlagos, São Paulo, Brazil"
      circuitSubName="Autodromo Jose Carlos Pace"
      imgSrc={brazilSrc}
      circuitLen={4.309}
      firstGP={1973}
      numLaps={71}
      fastLapTime="1:11.010"
      fastLapDriver="Sergio Perez (2021)"
      raceLen={305.879}
    />
    <Track
      circuitName="Las Vegas Strip Circuit, USA"
      imgSrc={lasVegasSrc}
      circuitLen={6.201}
      firstGP={2023}
      numLaps={50}
      fastLapTime="1:34.876"
      fastLapDriver="Lando Norris (2024)"
      raceLen={309.958}
    />
    <Track
      circuitName="Lusail International Circuit, Doha, Qatar"
      imgSrc={qatarSrc}
      circuitLen={5.419}
      firstGP={2021}
      numLaps={57}
      fastLapTime="1:22.384"
      fastLapDriver="Lando Norris (2024)"
      raceLen={308.611}
    />
    <Track
      circuitName="Yas Marina Circuit, Abu Dhabi"
      imgSrc={abuDhabiSrc}
      circuitLen={5.281}
      firstGP={2009}
      numLaps={58}
      fastLapTime="1:25.637"
      fastLapDriver="Kevin Magnussen (2024)"
      raceLen={306.183}
    />
  </Grid>
);

export default Tracks;

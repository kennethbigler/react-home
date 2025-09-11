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
import TrackStats from "./TrackStats";

const Tracks = () => (
  <Grid container spacing={3} width="100%">
    <TrackStats
      circuitName="Albert Park Circuit, Melbourne, Australia"
      imgSrc={australiaSrc}
      circuitLength={5.278}
      firstGrandPrix={1996}
      numberOfLaps={58}
      fastestLapTime="1:19.813"
      fastestLapDriver="Charles Leclerc (2024)"
      raceDistance={306.124}
    />
    <TrackStats
      circuitName="Shanghai International Circuit, China"
      imgSrc={chinaSrc}
      circuitLength={5.451}
      firstGrandPrix={2004}
      numberOfLaps={56}
      fastestLapTime="1:34.742"
      fastestLapDriver="Pierre Gasly (2019)"
      raceDistance={305.066}
    />
    <TrackStats
      circuitName="Suzuka Circuit, Japan"
      imgSrc={japanSrc}
      circuitLength={5.807}
      firstGrandPrix={1987}
      numberOfLaps={53}
      fastestLapTime="1:30.965"
      fastestLapDriver="Kimi Antonelli (2025)"
      raceDistance={307.471}
    />
    <TrackStats
      circuitName="Bahrain International Circuit"
      imgSrc={bahrainSrc}
      circuitLength={5.412}
      firstGrandPrix={2004}
      numberOfLaps={57}
      fastestLapTime="1:32.014"
      fastestLapDriver="Max Verstappen (2020)"
      raceDistance={308.238}
    />
    <TrackStats
      circuitName="Saudi Arabia Circuit"
      imgSrc={saudiSrc}
      circuitLength={6.174}
      firstGrandPrix={2021}
      numberOfLaps={50}
      fastestLapTime="1:30.734"
      fastestLapDriver="Lewis Hamilton (2021)"
      raceDistance={308.45}
    />
    <TrackStats
      circuitName="Miami International Autodrome, USA"
      imgSrc={miamiSrc}
      circuitLength={5.412}
      firstGrandPrix={2021}
      numberOfLaps={57}
      fastestLapTime="1:29.708"
      fastestLapDriver="Max Verstappen (2023)"
      raceDistance={308.326}
    />
    <TrackStats
      circuitName="Imola, Emilia-Romagna, Italy"
      circuitSubName="Autodromo Internazionale Enzo e Dino Ferrari"
      imgSrc={emiliaSrc}
      circuitLength={4.909}
      firstGrandPrix={1980}
      numberOfLaps={63}
      fastestLapTime="1:15.484"
      fastestLapDriver="Lewis Hamilton (2020)"
      raceDistance={309.049}
    />
    <TrackStats
      circuitName="Circuit de Monaco"
      imgSrc={monacoSrc}
      circuitLength={3.337}
      firstGrandPrix={1950}
      numberOfLaps={78}
      fastestLapTime="1:12.909"
      fastestLapDriver="Lewis Hamilton (2021)"
      raceDistance={260.286}
    />
    <TrackStats
      circuitName="Circuit de Barcelona-Catalunya, Spain"
      imgSrc={spainSrc}
      circuitLength={4.361}
      firstGrandPrix={1978}
      numberOfLaps={70}
      fastestLapTime="1:13.078"
      fastestLapDriver="Valtteri Bottas (2019)"
      raceDistance={305.27}
    />
    <TrackStats
      circuitName="Circuit Gilles-Villeneuve, Montreal, Canada"
      imgSrc={canadaSrc}
      circuitLength={4.361}
      firstGrandPrix={1978}
      numberOfLaps={70}
      fastestLapTime="1:13.078"
      fastestLapDriver="Valtteri Bottas (2019)"
      raceDistance={305.27}
    />
    <TrackStats
      circuitName="Red Bull Ring, Austria"
      imgSrc={austriaSrc}
      circuitLength={4.326}
      firstGrandPrix={1970}
      numberOfLaps={71}
      fastestLapTime="1:07.924"
      fastestLapDriver="Oscar Piastri (2025)"
      raceDistance={307.018}
    />
    <TrackStats
      circuitName="Silverstone Circuit, Great Britain"
      imgSrc={gbSrc}
      circuitLength={5.891}
      firstGrandPrix={1950}
      numberOfLaps={52}
      fastestLapTime="1:27.097"
      fastestLapDriver="Max Verstappen (2020)"
      raceDistance={306.198}
    />
    <TrackStats
      circuitName="Circuit de Spa-Francorchamps, Belgium"
      imgSrc={belgiumSrc}
      circuitLength={7.004}
      firstGrandPrix={1950}
      numberOfLaps={44}
      fastestLapTime="1:44.701"
      fastestLapDriver="Sergio Perez (2024)"
      raceDistance={308.052}
    />
    <TrackStats
      circuitName="Hungaroring, Hungary"
      imgSrc={hungarySrc}
      circuitLength={4.381}
      firstGrandPrix={1986}
      numberOfLaps={70}
      fastestLapTime="1:16.627"
      fastestLapDriver="Lewis Hamilton (2020)"
      raceDistance={306.63}
    />
    <TrackStats
      circuitName="Circuit Zandvoort, Netherlands"
      imgSrc={netherlandsSrc}
      circuitLength={4.259}
      firstGrandPrix={1952}
      numberOfLaps={72}
      fastestLapTime="1:11.097"
      fastestLapDriver="Lewis Hamilton (2021)"
      raceDistance={306.587}
    />
    <TrackStats
      circuitName="Autodromo Nazionale Monza, Italy"
      imgSrc={italySrc}
      circuitLength={5.793}
      firstGrandPrix={1950}
      numberOfLaps={53}
      fastestLapTime="1:20.901"
      fastestLapDriver="Lando Norris (2025)"
      raceDistance={306.72}
    />
    <TrackStats
      circuitName="Baku City Circuit, Azerbaijan"
      imgSrc={bakuSrc}
      circuitLength={6.003}
      firstGrandPrix={2016}
      numberOfLaps={51}
      fastestLapTime="1:43.009"
      fastestLapDriver="Charles Leclerc (2019)"
      raceDistance={306.049}
    />
    <TrackStats
      circuitName="Marina Bay Street Circuit, Singapore"
      imgSrc={singaporeSrc}
      circuitLength={4.94}
      firstGrandPrix={2008}
      numberOfLaps={62}
      fastestLapTime="1:34.486"
      fastestLapDriver="Daniel Ricciardo (2024)"
      raceDistance={306.143}
    />
    <TrackStats
      circuitName="Circuit of The Americas, Austin, USA"
      imgSrc={usaSrc}
      circuitLength={5.513}
      firstGrandPrix={2012}
      numberOfLaps={56}
      fastestLapTime="1:36.169"
      fastestLapDriver="Charles Leclerc (2019)"
      raceDistance={308.405}
    />
    <TrackStats
      circuitName="Autódromo Hermanos Rodríguez, Mexico City, Mexico"
      imgSrc={mexicoSrc}
      circuitLength={4.304}
      firstGrandPrix={1963}
      numberOfLaps={71}
      fastestLapTime="1:17.774"
      fastestLapDriver="Valtteri Bottas (2021)"
      raceDistance={305.354}
    />
    <TrackStats
      circuitName="Interlagos, São Paulo, Brazil"
      circuitSubName="Autodromo Jose Carlos Pace"
      imgSrc={brazilSrc}
      circuitLength={4.309}
      firstGrandPrix={1973}
      numberOfLaps={71}
      fastestLapTime="1:11.010"
      fastestLapDriver="Sergio Perez (2021)"
      raceDistance={305.879}
    />
    <TrackStats
      circuitName="Las Vegas Strip Circuit, USA"
      imgSrc={lasVegasSrc}
      circuitLength={6.201}
      firstGrandPrix={2023}
      numberOfLaps={50}
      fastestLapTime="1:34.876"
      fastestLapDriver="Lando Norris (2024)"
      raceDistance={309.958}
    />
    <TrackStats
      circuitName="Lusail International Circuit, Doha, Qatar"
      imgSrc={qatarSrc}
      circuitLength={5.419}
      firstGrandPrix={2021}
      numberOfLaps={57}
      fastestLapTime="1:22.384"
      fastestLapDriver="Lando Norris (2024)"
      raceDistance={308.611}
    />
    <TrackStats
      circuitName="Yas Marina Circuit, Abu Dhabi"
      imgSrc={abuDhabiSrc}
      circuitLength={5.281}
      firstGrandPrix={2009}
      numberOfLaps={58}
      fastestLapTime="1:25.637"
      fastestLapDriver="Kevin Magnussen (2024)"
      raceDistance={306.183}
    />
  </Grid>
);

export default Tracks;

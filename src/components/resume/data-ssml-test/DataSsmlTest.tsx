import { memo } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

// ---------------------------------------------------------------------------
// Inner helpers
// ---------------------------------------------------------------------------

interface TestCaseProps {
  title: string;
  directive: string;
  expected: string;
  children: React.ReactNode;
}

const TestCase = ({ title, directive, expected, children }: TestCaseProps) => (
  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ display: "block" }}
      gutterBottom
    >
      {title}
    </Typography>
    {/* The actual sentence NVDA will read — data-ssml attrs live here */}
    <Box sx={{ fontSize: "1.05rem", mb: 1.5, lineHeight: 1.8 }}>{children}</Box>
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: "flex-start", flexWrap: "wrap" }}
    >
      <Typography
        variant="body2"
        color="success.dark"
        sx={{ fontStyle: "italic" }}
      >
        NVDA should say: &quot;{expected}&quot;
      </Typography>
    </Stack>
    <Box
      component="pre"
      sx={{
        mt: 1.5,
        p: 1,
        bgcolor: "action.hover",
        borderRadius: 1,
        fontSize: "0.72rem",
        fontFamily: "monospace",
        overflowX: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        m: 0,
      }}
    >
      {directive}
    </Box>
  </Paper>
);

interface SectionProps {
  label: string;
  color: "primary" | "secondary" | "success" | "warning" | "info" | "error";
  children: React.ReactNode;
}

const Section = ({ label, color, children }: SectionProps) => (
  <Box sx={{ mb: 4 }}>
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
      <Chip label={label} color={color} size="small" />
    </Stack>
    {children}
  </Box>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const DataSsmlTest = memo(() => (
  <>
    <Typography variant="h2" component="h1" gutterBottom>
      data-ssml Test Page
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      This page tests the NVDA data-ssml addon. Each example shows the rendered
      text (with live <code>data-ssml</code> attributes), the expected NVDA
      pronunciation, and the JSON directive used. Navigate to each sentence with
      NVDA active to verify.
    </Typography>

    {/* ------------------------------------------------------------------ */}
    {/* sub — text substitution                                             */}
    {/* ------------------------------------------------------------------ */}
    <Section label="sub / alias — text substitution" color="primary">
      <TestCase
        title="Chemical element symbol → full name"
        directive='{"sub":{"alias":"silicon"}}'
        expected="My favorite element is silicon because it is neat"
      >
        My favorite element is{" "}
        <span data-ssml='{"sub":{"alias":"silicon"}}'>Si</span> because it is
        neat
      </TestCase>

      <TestCase
        title="Chemical formula → spoken name"
        directive='{"sub":{"alias":"sodium chloride"}}'
        expected="Common table salt is sodium chloride."
      >
        Common table salt is{" "}
        <span data-ssml='{"sub":{"alias":"sodium chloride"}}'>NaCl</span>.
      </TestCase>

      <TestCase
        title="Multiple substitutions in one sentence (coworker's example)"
        directive='{"sub":{"alias":"m r n  A"}}  /  {"sub":{"alias":"3 prime"}}  /  {"sub":{"alias":"A M Ps"}}'
        expected="The pre-m r n A is cleaved at its 3 prime end, and approximately 200 A M Ps are added to the cleaved end."
      >
        <label htmlFor="biology-example">
          The pre-
          <span data-ssml='{"sub":{"alias":"m r n  A"}}'>mRNA</span> is cleaved
          at its <span data-ssml='{"sub":{"alias":"3 prime"}}'>3&apos;</span>{" "}
          end, and approximately 200
          <span data-ssml='{"sub":{"alias":"A M Ps"}}'>AMPS</span> are added to
          the cleaved end.
        </label>
      </TestCase>

      <TestCase
        title="Acronym expansion"
        directive='{"sub":{"alias":"Speech Synthesis Markup Language"}}'
        expected="This page tests Speech Synthesis Markup Language pronunciation."
      >
        This page tests{" "}
        <span data-ssml='{"sub":{"alias":"Speech Synthesis Markup Language"}}'>
          SSML
        </span>{" "}
        pronunciation.
      </TestCase>

      <TestCase
        title="Biology acronym"
        directive='{"sub":{"alias":"deoxyribonucleic acid"}}'
        expected="DNA, or deoxyribonucleic acid, carries genetic information."
      >
        <span data-ssml='{"sub":{"alias":"deoxyribonucleic acid"}}'>DNA</span>,
        or deoxyribonucleic acid, carries genetic information.
      </TestCase>

      <TestCase
        title="Extended array format — targeted substitution within a longer string"
        directive='{"sub":[{"text":"Fe","alias":"iron"}]}'
        expected="The atomic symbol for iron is Fe."
      >
        The atomic symbol for{" "}
        <span data-ssml='{"sub":[{"text":"Fe","alias":"iron"}]}'>Fe</span> is
        iron.
      </TestCase>
    </Section>

    {/* ------------------------------------------------------------------ */}
    {/* say-as — character / interpretation mode                            */}
    {/* ------------------------------------------------------------------ */}
    <Section label="say-as — character interpretation" color="secondary">
      <TestCase
        title="Binary number — read digit by digit"
        directive='{"say-as":{"interpret-as":"characters"}}'
        expected="The binary value one zero one one one equals twenty-three."
      >
        The binary value{" "}
        <span data-ssml='{"say-as":{"interpret-as":"characters"}}'>10111</span>{" "}
        equals twenty-three.
      </TestCase>

      <TestCase
        title="Chemical formula — spell out each character"
        directive='{"say-as":{"interpret-as":"characters"}}'
        expected="C O 2 is a greenhouse gas."
      >
        <span data-ssml='{"say-as":{"interpret-as":"characters"}}'>CO2</span> is
        a greenhouse gas.
      </TestCase>

      <TestCase
        title="Abbreviation — read as individual letters"
        directive='{"say-as":{"interpret-as":"characters"}}'
        expected="The gene locus is B R C A 1."
      >
        The gene locus is{" "}
        <span data-ssml='{"say-as":{"interpret-as":"characters"}}'>BRCA1</span>.
      </TestCase>
    </Section>

    {/* ------------------------------------------------------------------ */}
    {/* phoneme — IPA pronunciation                                         */}
    {/* ------------------------------------------------------------------ */}
    <Section label="phoneme — IPA pronunciation" color="success">
      <TestCase
        title="Ambiguous place name: Reading, PA (REH-ding, not REE-ding)"
        directive='{"phoneme":{"alphabet":"ipa","ph":"ˈrɛdɪŋ"}}'
        expected="I grew up in REH-ding, Pennsylvania."
      >
        I grew up in{" "}
        <span data-ssml='{"phoneme":{"alphabet":"ipa","ph":"ˈrɛdɪŋ"}}'>
          Reading
        </span>
        , Pennsylvania.
      </TestCase>

      <TestCase
        title="Disputed pronunciation: pecan (pih-KAHN)"
        directive='{"phoneme":{"alphabet":"ipa","ph":"pɪˈkɑːn"}}'
        expected="Would you like a pih-KAHN pie?"
      >
        Would you like a{" "}
        <span data-ssml='{"phoneme":{"alphabet":"ipa","ph":"pɪˈkɑːn"}}'>
          pecan
        </span>{" "}
        pie?
      </TestCase>

      <TestCase
        title="GIF pronunciation (hard G)"
        directive='{"phoneme":{"alphabet":"ipa","ph":"ɡɪf"}}'
        expected="It is pronounced gif, with a hard G."
      >
        It is pronounced{" "}
        <span data-ssml='{"phoneme":{"alphabet":"ipa","ph":"ɡɪf"}}'>GIF</span>,
        with a hard G.
      </TestCase>
    </Section>

    {/* ------------------------------------------------------------------ */}
    {/* break — timed pauses                                                */}
    {/* ------------------------------------------------------------------ */}
    <Section label="break — timed pauses" color="warning">
      <TestCase
        title="500ms pause mid-sentence"
        directive='{"break":{"time":"500ms"}}'
        expected="This sentence has a pause [500ms silence] then continues normally."
      >
        This sentence has a pause{" "}
        <span data-ssml='{"break":{"time":"500ms"}}'>here</span>, then continues
        normally.
      </TestCase>

      <TestCase
        title="Strong-strength pause (≈ 600ms) between clauses"
        directive='{"break":{"strength":"strong"}}'
        expected="Inhale [strong pause] exhale."
      >
        Inhale
        <span data-ssml='{"break":{"strength":"strong"}}'>…</span>exhale.
      </TestCase>

      <TestCase
        title="2-second pause for dramatic effect"
        directive='{"break":{"time":"2s"}}'
        expected="And the winner is [2s pause] you!"
      >
        And the winner is
        <span data-ssml='{"break":{"time":"2s"}}'>…</span>you!
      </TestCase>
    </Section>

    {/* ------------------------------------------------------------------ */}
    {/* prosody — speaking rate                                             */}
    {/* ------------------------------------------------------------------ */}
    <Section label="prosody — speaking rate" color="info">
      <TestCase
        title="Slow rate — hard-to-pronounce word"
        directive='{"prosody":{"rate":"slow"}}'
        expected='"Tyrannosaurus Rex" spoken slowly'
      >
        The dinosaur{" "}
        <span data-ssml='{"prosody":{"rate":"slow"}}'>Tyrannosaurus Rex</span>{" "}
        was a fearsome predator.
      </TestCase>

      <TestCase
        title="X-slow rate — tongue twister"
        directive='{"prosody":{"rate":"x-slow"}}'
        expected='"She sells seashells" spoken very slowly'
      >
        Try saying:{" "}
        <span data-ssml='{"prosody":{"rate":"x-slow"}}'>
          She sells seashells by the seashore
        </span>
        .
      </TestCase>

      <TestCase
        title="Fast rate — auctioneer style"
        directive='{"prosody":{"rate":"fast"}}'
        expected='"going once going twice sold" spoken quickly'
      >
        The auctioneer called:{" "}
        <span data-ssml='{"prosody":{"rate":"fast"}}'>
          going once going twice sold
        </span>
        !
      </TestCase>
    </Section>

    {/* ------------------------------------------------------------------ */}
    {/* combined — multiple directives on one page                         */}
    {/* ------------------------------------------------------------------ */}
    <Section label="combined — real-world science passage" color="error">
      <TestCase
        title="Full paragraph with mixed sub and phoneme directives"
        directive="(multiple — see spans)"
        expected="Water, or H 2 O, has a molar mass of 18.015 grams per mole. The element silicon appears in group 14 of the periodic table. Reading University studied pecan tree growth."
      >
        Water, or <span data-ssml='{"sub":{"alias":"H 2 O"}}'>H₂O</span>, has a
        molar mass of 18.015{" "}
        <span data-ssml='{"sub":{"alias":"grams per mole"}}'>g/mol</span>. The
        element <span data-ssml='{"sub":{"alias":"silicon"}}'>Si</span> appears
        in group 14 of the periodic table.{" "}
        <span data-ssml='{"phoneme":{"alphabet":"ipa","ph":"ˈrɛdɪŋ"}}'>
          Reading
        </span>{" "}
        University studied{" "}
        <span data-ssml='{"phoneme":{"alphabet":"ipa","ph":"pɪˈkɑːn"}}'>
          pecan
        </span>{" "}
        tree growth.
      </TestCase>
    </Section>
  </>
));

DataSsmlTest.displayName = "DataSsmlTest";

export default DataSsmlTest;

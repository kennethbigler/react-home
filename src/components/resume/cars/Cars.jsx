import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import prius07 from '../../../images/07_toyota_prius.jpg';
import pontiac93 from '../../../images/93_pontiac_bonneville.jpg';
import impala10 from '../../../images/10_chevrolet_impala_ls.jpg';
import mustang15 from '../../../images/15_mustang_gt_premium.jpg';
import jaguar05 from '../../../images/05_jaguar_xj8l.jpg';

const styles = {
  container: {
    maxWidth: 1488,
    margin: 'auto',
    marginTop: 20,
  },
  img: {
    width: '100%',
    maxWidth: '30em',
  },
};

// max 1512px?

const Cars = () => (
  <div>
    <Typography variant="h2">{'Ken\'s Cars'}</Typography>
    <Card style={styles.container}>
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          <CardContent>
            <Typography variant="h5">2008</Typography>
            <Typography>The car I learned how to drive on while I had my driver&lsquo;s permit was my father&lsquo;s new 2007 Toyota Prius.</Typography>
          </CardContent>
        </Grid>
        <Grid item sm={4} xs={12}>
          <img
            src={prius07}
            alt="2007 Toyota Prius"
            style={styles.img}
          />
        </Grid>
      </Grid>
    </Card>
    <Card style={styles.container}>
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          <CardContent>
            <Typography variant="h5">2008</Typography>
            <Typography>I got my first car: a 1993 Pontiac Bonneville. It was previously my grandfather&lsquo;s (mother&lsquo;s side) and I got it as my first car when I got my license.</Typography>
          </CardContent>
        </Grid>
        <Grid item sm={4} xs={12}>
          <img
            src={pontiac93}
            alt="1993 Pontiac Bonneville"
            style={styles.img}
          />
        </Grid>
      </Grid>
    </Card>
    <Card style={styles.container}>
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          <CardContent>
            <Typography variant="h5">2011</Typography>
            <Typography>After selling my first car, my parents purchased a 2010 Chevrolet Impala LS for me to drive. It was a used Hertz rental car.</Typography>
          </CardContent>
        </Grid>
        <Grid item sm={4} xs={12}>
          <img
            src={impala10}
            alt="2010 Chevrolet Impala"
            style={styles.img}
          />
        </Grid>
      </Grid>
    </Card>
    <Card style={styles.container}>
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          <CardContent>
            <Typography variant="h5">2015</Typography>
            <Typography>
              I purchased my first vehicle, a new 2015 Ford Mustang GT Premium with the 50 Years Edition Package.
              I did some modifications to this car including: Rear Window Louvers, GT350 start button, metal dead pedal, ergonomic parking break, Borla Ford Racing Sport Catback Exhaust, &amp; Hurst automatic shift lever
            </Typography>
          </CardContent>
        </Grid>
        <Grid item sm={4} xs={12}>
          <img
            src={mustang15}
            alt="2015 Ford Mustang GT Premium"
            style={styles.img}
          />
        </Grid>
      </Grid>
    </Card>
    <Card style={styles.container}>
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          <CardContent>
            <Typography variant="h5">2019</Typography>
            <Typography>I sold my Mustang (as the exhaust was too loud), and started driving a 2005 Jaguar XJ8-L that my grandfather (father&lsquo;s side) had given to my family.</Typography>
          </CardContent>
        </Grid>
        <Grid item sm={4} xs={12}>
          <img
            src={jaguar05}
            alt="2005 Jaguar XJ8-L"
            style={styles.img}
          />
        </Grid>
      </Grid>
    </Card>
  </div>
);

export default Cars;

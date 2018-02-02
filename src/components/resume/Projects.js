import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import projects from '../../constants/projects';
// Parents: Main

const styles = {
  body: {
    margin: '-1em'
  },
  photo: {
    display: 'block',
    margin: 'auto',
    width: '100%',
    maxWidth: 'auto',
    cursor: 'pointer'
  },
  center: {
    textAlign: 'center'
  }
};

const href = url => window.open(url);

export const Projects = () => (
  <div style={styles.body}>
    <Tabs>
      {projects.map(p => (
        <Tab label={p.title} key={p.title}>
          <div className="container">
            <h3 style={styles.center}>{p.caption}</h3>
            <img
              onTouchTap={href(p.link)}
              src={p.src}
              alt={p.alt}
              style={styles.photo}
            />
          </div>
        </Tab>
      ))}
    </Tabs>
  </div>
);

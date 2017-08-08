import React from "react";
import { Tabs, Tab } from "material-ui/Tabs";
import projects from "../../constants/projects";

const styles = {
  body: {
    margin: "-1em"
  },
  photo: {
    display: "block",
    margin: "auto",
    width: "100%",
    maxWidth: "auto"
  },
  center: {
    textAlign: "center"
  }
};

const Projects = () => {
  return (
    <div style={styles.body}>
      <Tabs>
        {projects.map(project => {
          return (
            <Tab label={project.title} key={project.title}>
              <div className="container">
                <h3 style={styles.center}>
                  {project.caption}
                </h3>
                <a href={project.link} rel="noopener">
                  <img
                    src={project.src}
                    alt={project.alt}
                    style={styles.photo}
                  />
                </a>
              </div>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
};

export default Projects;

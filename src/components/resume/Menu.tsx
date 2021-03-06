import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import noop from '../../apis/noop';

interface MenuProps {
  onItemClick?: (loc: string) => void;
}

// external links
const github = (): void => { window.open('https://github.com/kennethbigler/react-home'); };
const linkedIn = (): void => { window.open('https://www.linkedin.com/in/kennethbigler'); };
const stackOverflow = (): void => { window.open('https://stackoverflow.com/users/4830309/ken-bigler'); };

const Menu: React.FC<MenuProps> = React.memo((props: MenuProps) => {
  const { onItemClick } = props;
  // internal routes
  const menu = React.useMemo(() => [
    { name: 'Summary', route: '' },
    { name: 'Work', route: 'work' },
    { name: 'Resume', route: 'resume' },
    { name: 'Hackathons & Education', route: 'education' },
    { divider: true },
    { name: 'Git Tools', route: 'git-tools' },
    { name: 'GraphQL Demo', route: 'graphql' },
    { divider: true },
    { name: 'Cars', route: 'cars' },
    { name: 'Travel Map', route: 'travel' },
    { name: 'Murder Mystery', route: 'murder' },
    { name: 'Poker Night Scores', route: 'poker' },
    { name: 'React Games', route: 'games' },
  ].map((item, index) => (item.divider
    ? (
      <Divider key={index} />
    ) : (
      <MenuItem key={item.name} onClick={(): void => (onItemClick ? onItemClick(`/${item.route}`) : noop())}>
        {item.name}
      </MenuItem>
    )
  )), [onItemClick]);

  return (
    <>
      {menu}
      <Divider />
      <MenuItem onClick={github}>
        GitHub
      </MenuItem>
      <MenuItem onClick={linkedIn}>
        LinkedIn
      </MenuItem>
      <Divider />
      <br />
      <img
        alt="profile for Ken Bigler at Stack Overflow, Q&A for professional and enthusiast programmers"
        id="stackOverflow"
        onClick={stackOverflow}
        src="https://stackoverflow.com/users/flair/4830309.png?theme=dark"
        style={{
          display: 'block',
          margin: 'auto',
          cursor: 'pointer',
          width: 240,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      />
    </>
  );
});

export default Menu;

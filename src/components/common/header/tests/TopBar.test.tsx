import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import render from '../../../../redux-test-render';
import TopBar from '../TopBar';

describe('common | header | TopBar', () => {
  describe('basic props tests', () => {
    it('changes fontColor as expected', () => {
      const { rerender } = render(<TopBar fontColor="textPrimary" iconColor="primary" toggleOpen={jest.fn()} />);
      expect(screen.getByText('Menu').className).toContain('MuiTypography-colorTextPrimary');

      rerender(<TopBar fontColor="textSecondary" iconColor="primary" toggleOpen={jest.fn()} />);
      expect(screen.getByText('Menu').className).toContain('MuiTypography-colorTextSecondary');

      rerender(<TopBar fontColor="primary" iconColor="primary" toggleOpen={jest.fn()} />);
      expect(screen.getByText('Menu').className).toContain('MuiTypography-colorPrimary');

      rerender(<TopBar fontColor="secondary" iconColor="primary" toggleOpen={jest.fn()} />);
      expect(screen.getByText('Menu').className).toContain('MuiTypography-colorSecondary');
    });

    it('changes iconColor as expected', () => {
      const { rerender } = render(<TopBar fontColor="primary" iconColor="primary" toggleOpen={jest.fn()} />);
      expect(screen.getByTitle('Icon Menu Button').className).toContain('MuiIconButton-colorPrimary');

      rerender(<TopBar fontColor="primary" iconColor="secondary" toggleOpen={jest.fn()} />);
      expect(screen.getByTitle('Icon Menu Button').className).toContain('MuiIconButton-colorSecondary');
    });

    it('shows players as expected', () => {
      const { rerender } = render(<TopBar fontColor="primary" iconColor="primary" toggleOpen={jest.fn()} showPlayers />);
      expect(screen.getByText('Players')).toBeInTheDocument();

      rerender(<TopBar fontColor="primary" iconColor="primary" toggleOpen={jest.fn()} showPlayers={false} />);
      expect(screen.queryByText('Players')).toBeNull();
    });

    it('toggles open as expected', () => {
      const handleOpen = jest.fn();
      render(<TopBar fontColor="primary" iconColor="primary" toggleOpen={handleOpen} />);
      fireEvent.click(screen.getByText('Menu'));
      expect(handleOpen).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByTitle('Icon Menu Button'));
      expect(handleOpen).toHaveBeenCalledTimes(2);
    });
  });

  describe('theme toggle', () => {
    it('toggles theme as expected', () => {
      const handleOpen = jest.fn();
      const { container } = render(<TopBar fontColor="primary" iconColor="primary" toggleOpen={handleOpen} />);
      const ThemeToggle = screen.getByTitle('Theme Toggle Switch').querySelector('.MuiSwitch-input');

      expect(ThemeToggle?.attributes?.getNamedItem('value')?.value).toEqual('false');
      expect(container.querySelector('.header-light-theme')).toBeNull();
      expect(container.querySelector('.header-dark-theme')).toBeInTheDocument();

      fireEvent.click(ThemeToggle || screen.getByTitle('Theme Toggle Switch'));

      expect(ThemeToggle?.attributes?.getNamedItem('value')?.value).toEqual('true');
      expect(container.querySelector('.header-light-theme')).toBeInTheDocument();
      expect(container.querySelector('.header-dark-theme')).toBeNull();
    });
  });
});

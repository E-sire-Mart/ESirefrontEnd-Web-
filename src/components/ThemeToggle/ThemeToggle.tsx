import React from 'react';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <Button
        type="text"
        icon={mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
        onClick={toggleTheme}
        className="theme-toggle-button"
        size="large"
      />
    </Tooltip>
  );
};

export default ThemeToggle;

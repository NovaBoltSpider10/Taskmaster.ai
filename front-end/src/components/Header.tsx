import React from "react";
import "./Header.css";

interface HeaderBarProps {
  title: string;
  onBack?: () => void;
  children?: React.ReactNode;
  greeting: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onBack,
  children,
  greeting,
}) => {
  return (
    <header className="header">
      <div className="left-section">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            &lt; Back
          </button>
        )}
      </div>
      <div className="title-section">
        <h1 className="title">{title}</h1>
      </div>
      <div className="middle-section">
        <div className="message-container">
          <div className="greeting-message">{greeting}</div>
        </div>
      </div>
      <div className="right-section">{children}</div>
    </header>
  );
};

export default HeaderBar;

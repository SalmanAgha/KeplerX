import React from 'react';
import './Breadcrumb.css';

interface BreadcrumbProps {
  title: string;
  path: string[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, path }) => {
  return (
    <div className="breadcrumb-container">
      <div className="breadcrumb-overlay">
        <div className="container">
          <h1 className="breadcrumb-title">{title}</h1>
          <div className="breadcrumb-path">
            {path.map((item, index) => (
              <React.Fragment key={index}>
                <span className="breadcrumb-item">{item}</span>
                {index < path.length - 1 && <span className="breadcrumb-separator">/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb; 
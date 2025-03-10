import React from 'react';
import './GraphicDesignToolsSlider.css';

const GraphicDesignToolsSlider: React.FC = () => {
  // Create array of graphic design tools logos
  const designTools = [
    { name: 'Adobe Photoshop', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg' },
    { name: 'Adobe Illustrator', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg' },
    { name: 'Adobe InDesign', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/indesign/indesign-plain.svg' },
    { name: 'Adobe XD', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg' },
    { name: 'Adobe After Effects', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg' },
    { name: 'Adobe Premiere Pro', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg' },
    { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
    { name: 'Sketch', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg' },
    { name: 'Canva', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' },
    { name: 'Blender', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg' },
    { name: 'Cinema 4D', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c4d/c4d-original.svg' },
    { name: 'Inkscape', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/inkscape/inkscape-original.svg' },
    { name: 'GIMP', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gimp/gimp-original.svg' },
    { name: 'Affinity Designer', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/affinity/affinity-original.svg' },
    { name: 'Procreate', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/procreate/procreate-original.svg' },
    { name: 'CorelDRAW', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/coreldraw/coreldraw-original.svg' },
    { name: 'Autodesk Maya', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maya/maya-original.svg' },
    { name: 'Zeplin', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/zeplin/zeplin-original.svg' },
  ];

  // Duplicate the array to create a seamless loop
  const logoElements = [...designTools, ...designTools].map((tool, index) => (
    <div className="design-tool-logo" key={index}>
      <img src={tool.logo} alt={tool.name} />
    </div>
  ));

  return (
    <div className="design-tools-section">
      <h2 className="design-tools-title">DESIGN TOOLS WE MASTER</h2>
      <div className="title-underline"></div>
      <div className="design-tools-slider-container">
        <div className="design-tools-slider">
          {logoElements}
        </div>
      </div>
    </div>
  );
};

export default GraphicDesignToolsSlider; 
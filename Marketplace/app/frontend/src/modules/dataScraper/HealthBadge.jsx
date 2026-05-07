import React from 'react';
import { useScraper } from '../../context/ScraperContext';
export default function HealthBadge(){
  const { healthy } = useScraper();
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:4}}>
      <span style={{width:8,height:8,borderRadius:'50%',background:healthy?'#2ecc71':'#e74c3c'}}></span>
      {healthy? 'Service running':'Service offline'}
    </span>
  );
}

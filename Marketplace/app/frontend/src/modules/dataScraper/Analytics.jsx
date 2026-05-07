import React from 'react';
import { useScraper } from '../../context/ScraperContext';
import HealthBadge from './HealthBadge';

export default function Analytics(){
  const { jobs } = useScraper();
  const completed = jobs.filter(j=>j.status==='completed');
  const totalPages = completed.reduce((a,b)=>a+(b.pages_scraped||0),0);
  return (
    <div>
      <HealthBadge />
      <h4 style={{marginTop:16}}>Jobs completed: {completed.length}</h4>
      <h4>Total pages scraped: {totalPages}</h4>
    </div>
  );
}

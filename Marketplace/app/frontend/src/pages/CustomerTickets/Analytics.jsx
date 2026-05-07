import React from 'react';

function Analytics({ tickets=[] }){
  const total = tickets.length;
  return (
    <div>
      <h2>Analytics</h2>
      <p>Total tickets: {total}</p>
      {/* Add more charts later */}
    </div>
  );
}
export default Analytics;

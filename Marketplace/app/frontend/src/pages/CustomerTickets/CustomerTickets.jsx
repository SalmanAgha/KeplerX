import React, { useEffect, useState } from 'react';
import { getTickets } from '../../api/tickets';
import AllTickets from './AllTickets';
import Analytics from './Analytics';
import Tabs from '../../components/common/Tabs/Tabs';
import './CustomerTickets.css';

function CustomerTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    (async () => {
      try {
        const response = await getTickets({limit:1000});
        setTickets(Array.isArray(response)? response : response.rows);
      } catch (err) {
        setError(err.message || 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading tickets…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const tabs=[
    {id:'analytics',label:'Analytics',content:<Analytics tickets={tickets}/>},
    {id:'all',label:'All Tickets',content:<AllTickets tickets={tickets}/>},
  ];
  return (
    <div className="tickets-card-wrapper">
      <div className="tickets-card">
        <h2>Customer Tickets</h2>
        <Tabs tabs={tabs}/>
      </div>
    </div>
  );
}

export default CustomerTickets;

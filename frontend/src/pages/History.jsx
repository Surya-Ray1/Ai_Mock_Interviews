import { useEffect, useState } from 'react';
import { listSessions } from '../services/api';
import { Table, Placeholder } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function History(){
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ const resp = await listSessions(); setItems(resp.data || resp); setLoading(false); })(); },[]);
  return (
    <Table hover responsive>
      <thead><tr><th>ID</th><th>Role</th><th>Difficulty</th><th>Started</th><th>Score</th></tr></thead>
      <tbody>
        {loading && Array.from({length:5}).map((_,i)=> (
          <tr key={i}>
            <td><Placeholder as="span" animation="glow"><Placeholder xs={4}/></Placeholder></td>
            <td><Placeholder as="span" animation="glow"><Placeholder xs={6}/></Placeholder></td>
            <td><Placeholder as="span" animation="glow"><Placeholder xs={5}/></Placeholder></td>
            <td><Placeholder as="span" animation="glow"><Placeholder xs={7}/></Placeholder></td>
            <td><Placeholder as="span" animation="glow"><Placeholder xs={3}/></Placeholder></td>
          </tr>
        ))}

        {!loading && items.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center text-secondary py-4">No sessions yet. Start your first interview!</td>
          </tr>
        )}

        {items.map(it => (
          <tr key={it.id} style={{cursor:'pointer'}} onClick={()=>nav(`/results/${it.id}`)}>
            <td>{it.id}</td><td>{it.role||'—'}</td><td>{it.difficulty}</td><td>{new Date(it.started_at).toLocaleString()}</td><td>{it.score_overall ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
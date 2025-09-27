import { useEffect, useState } from 'react';
import { listSessions } from '../services/api';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function History(){
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  useEffect(()=>{ (async()=>{ const resp = await listSessions(); setItems(resp.data || resp); })(); },[]);
  return (
    <Table hover responsive>
      <thead><tr><th>ID</th><th>Role</th><th>Difficulty</th><th>Started</th><th>Score</th></tr></thead>
      <tbody>
        {items.map(it => (
          <tr key={it.id} style={{cursor:'pointer'}} onClick={()=>nav(`/results/${it.id}`)}>
            <td>{it.id}</td><td>{it.role||'—'}</td><td>{it.difficulty}</td><td>{new Date(it.started_at).toLocaleString()}</td><td>{it.score_overall ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSession } from '../services/api';
import { Card, Table, ProgressBar } from 'react-bootstrap';

export default function Results(){
  const { id } = useParams();
  const [s, setS] = useState(null);
  useEffect(()=>{ (async()=> setS(await getSession(id)))(); },[id]);
  if(!s) return null;
  const rubric = s.rubric_json || {};
  const meter = (v)=> <ProgressBar now={(v||0)*20} label={`${v||0}/5`} />;
  return (
    <Card>
      <Card.Body>
        <h4>Score: {s.score_overall ?? '—'}</h4>
        <p>Role: {s.role || '—'} · Duration: {s.duration_sec ? `${s.duration_sec}s` : '—'}</p>
        <h6>Rubric</h6>
        <Table size="sm" bordered>
          <tbody>
            {Object.entries(rubric).map(([k,v]) => (
              <tr key={k}><td>{k}</td><td>{meter(v)}</td></tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
// src/pages/InterviewRoom.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Badge, Alert, Spinner, Modal, Form } from "react-bootstrap";
import { getSession, finishSession, askAi, redeemCode } from "../services/api";

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function InterviewRoom() {
  const { id } = useParams();
  const nav = useNavigate();

  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errText, setErrText] = useState("");
  const [errStatus, setErrStatus] = useState(null);

  // upgrade modal
  const [showUnlock, setShowUnlock] = useState(false);
  const [invite, setInvite] = useState("");
  const [unlockMsg, setUnlockMsg] = useState("");

  const recRef = useRef(null);
  const inFlight = useRef(false);
  const lastUtterAtRef = useRef(0);
  const lastUserTextRef = useRef("");

  const stopBrowserVoice = () => {
    try { recRef.current?.stop(); } catch {}
    setListening(false);
    try { window.speechSynthesis?.cancel(); } catch {}
  };

  const showError = (e) => {
    const status = e?.response?.status || null;
    setErrStatus(status);

    if (status === 402) {
      // Payment Required = our free cap was hit
      stopBrowserVoice();
      setShowUnlock(true); // pop unlock modal
    }

    const detail =
      e?.response?.data?.detail ||
      e?.response?.data?.error ||
      e?.message ||
      (typeof e === "string" ? e : "Something went wrong");
    setErrText(String(detail));
    console.error("ERR", status, detail, e?.response?.data);
  };

  const waitForVoices = () =>
    new Promise((resolve) => {
      if (!window.speechSynthesis) return resolve();
      const have = window.speechSynthesis.getVoices();
      if (have && have.length) return resolve();
      const iv = setInterval(() => {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length) { clearInterval(iv); resolve(); }
      }, 50);
      setTimeout(() => { clearInterval(iv); resolve(); }, 1500);
    });

  const pickVoice = (langPref = "en-US") => {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    const byLang = voices.filter((v) =>
      (v.lang || "").toLowerCase().startsWith(langPref.toLowerCase().slice(0, 2))
    );
    const pref = ["Google US English", "Samantha", "Serena", "Victoria"];
    for (const name of pref) {
      const m = voices.find((v) => v.name.includes(name));
      if (m) return m;
    }
    return byLang[0] || voices[0] || null;
  };

  const speak = async (text, lang = "en-US") => {
    if (!window.speechSynthesis) return;
    await waitForVoices();
    return new Promise((resolve) => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1; u.pitch = 1; u.lang = lang;
        const v = pickVoice(lang); if (v) u.voice = v;
        u.onend = resolve; u.onerror = resolve;
        try { window.speechSynthesis.resume(); } catch {}
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      } catch { resolve(); }
    });
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const s = await getSession(id);
        setSession(s);
        setMessages(s.transcripts || []);
      } catch (e) { showError(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const startBrowserVoice = async () => {
    setErrText(""); setErrStatus(null);

    if (!SR) { showError("Your browser does not support Web Speech API (try Chrome)."); return; }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      showError("Microphone permission denied. Allow mic access and try again.");
      return;
    }

    // AI intro
    try {
      if (inFlight.current) return;
      inFlight.current = true;

      const seed = "Start the interview: greet me briefly and ask the first question using STAR. Keep it under 20 words.";
      const { text } = await askAi({ interview_id: id, user_text: seed });
      setMessages((m) => [...m, { speaker: "ai", text }]);
      await speak(text, "en-US");
    } catch (e) {
      showError(e);
      inFlight.current = false;
      return;
    } finally {
      inFlight.current = false;
    }

    // Listen
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = async (e) => {
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript;
      }
      finalText = finalText.trim();
      if (!finalText || finalText.length < 3) return;

      const now = Date.now();
      if (now - lastUtterAtRef.current < 400) return;
      if (finalText === lastUserTextRef.current) return;
      lastUtterAtRef.current = now;
      lastUserTextRef.current = finalText;

      if (inFlight.current) return;
      inFlight.current = true;

      try {
        const { text } = await askAi({ interview_id: id, user_text: finalText });
        setMessages((m) => [
          ...m,
          { speaker: "user", text: finalText },
          { speaker: "ai", text },
        ]);
        await speak(text, "en-US");
      } catch (e2) {
        showError(e2);
      } finally {
        inFlight.current = false;
      }
    };

    rec.onerror = (e) => setErrText(`Speech error: ${e.error || e.message || "unknown"}`);
    rec.onend   = () => setListening(false);

    try {
      rec.start();
      recRef.current = rec;
      setListening(true);
    } catch (e) {
      showError(e);
    }
  };

  const finish = async () => {
    stopBrowserVoice();
    try {
      const rubric = { communication: 4, structure: 3, depth: 4, accuracy: 3 };
      await finishSession(id, { rubric_json: rubric });
      nav(`/results/${id}`);
    } catch (e) { showError(e); }
  };

  const titleText = session?.role ? `${session.role} Interview` : "Live Interview";
  const userName = "You";
  const micPip = listening ? "rec" : "idle";

  const reachedCap =
    errStatus === 402 ||
    errText?.toLowerCase().includes("free limit");

  // Unlock handler
  const redeem = async (e) => {
    e.preventDefault();
    setUnlockMsg("");
    try {
      const res = await redeemCode(invite.trim());
      setUnlockMsg(`Success! Plan: ${res.plan}. You can continue the interview.`);
      setErrText(""); setErrStatus(null);
      setShowUnlock(false);
    } catch (e2) {
      setUnlockMsg(e2?.response?.data?.error || "Failed to redeem code.");
    }
  };

  return (
    <div className="iv-stage">
      <div className="iv-header">
        <div className="iv-title">
          {titleText}
          {loading && <Spinner size="sm" className="ms-2" />}
        </div>
        <div className="iv-chips">
          {(session?.meta?.tech_stack || "")
            .split(",").map((c) => c.trim()).filter(Boolean).slice(0, 4)
            .map((c, i) => (
              <Badge key={i} bg="dark" className="iv-chip">{c}</Badge>
            ))}
          <Badge bg="secondary" className="iv-chip">browser voice</Badge>
        </div>
      </div>

      <div className="iv-tiles">
        <div className="iv-tile iv-ai">
          <div className={`iv-avatar ${micPip}`}><span role="img" aria-label="ai">💬</span></div>
          <div className="iv-name">AI Interviewer</div>
        </div>
        <div className="iv-tile iv-user">
          <div className="iv-avatar"><img src="https://i.pravatar.cc/200?img=12" alt="avatar" className="iv-avatar-img" /></div>
          <div className="iv-name">{userName}</div>
        </div>
      </div>

      <div className="iv-controls">
        {listening ? (
          <Button size="lg" variant="warning" onClick={stopBrowserVoice}>Stop</Button>
        ) : (
          <Button size="lg" onClick={startBrowserVoice} disabled={reachedCap}>Start</Button>
        )}
        <Button size="lg" variant="success" onClick={finish}>Finish</Button>
      </div>

      {errText && (
        <Alert variant={reachedCap ? "info" : "danger"} className="iv-error">
          {reachedCap
            ? "Free trial limit reached. Enter an unlock code to continue."
            : errText}
        </Alert>
      )}

      {/* Unlock modal */}
      <Modal show={showUnlock} onHide={() => setShowUnlock(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Unlock Realtime</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={redeem}>
            <Form.Group className="mb-3">
              <Form.Label>Invite / Unlock Code</Form.Label>
              <Form.Control
                value={invite}
                onChange={(e) => setInvite(e.target.value)}
                placeholder="Enter code"
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100">Redeem</Button>
          </Form>
          {unlockMsg && <Alert className="mt-2" variant="secondary">{unlockMsg}</Alert>}
          <div className="mt-3 text-muted" style={{fontSize: 13}}>
            Don’t have a code? Contact admin to upgrade your plan.
          </div>
        </Modal.Body>
      </Modal>

      <div className="iv-transcripts">
        {messages.slice(-6).map((m, i) => (
          <div key={i} className={`iv-bubble ${m.speaker}`}>
            <strong>{m.speaker.toUpperCase()}:</strong> {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}

import { createContext, useContext, useMemo, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastCtx = createContext({ push: ()=>{} });

export function ToasterProvider({ children }){
  const [items, setItems] = useState([]);

  const push = (variant, title, message, timeout=3500) => {
    const id = Math.random().toString(36).slice(2);
    setItems(list => [...list, { id, variant, title, message }]);
    if (timeout) setTimeout(()=> setItems(list => list.filter(t=>t.id!==id)), timeout);
  };

  const value = useMemo(()=>({ push }), []);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <ToastContainer position="bottom-end" className="p-3">
        {items.map(t => (
          <Toast bg={t.variant} key={t.id} onClose={()=> setItems(list => list.filter(i=>i.id!==t.id))}>
            {t.title && <Toast.Header closeButton><strong className="me-auto">{t.title}</strong></Toast.Header>}
            <Toast.Body>{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastCtx.Provider>
  );
}

export const useToaster = () => useContext(ToastCtx);

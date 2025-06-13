import React, { useState } from 'react';
import axios from 'axios';

export default function NotificationPanel() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const sendBroadcast = async () => {
    if (!message.trim()) return setStatus('❌ Message is empty');
    try {
      await axios.post('/api/admin/broadcast', { message });
      setStatus('✅ Message sent to all users');
      setMessage('');
    } catch (err) {
      setStatus('❌ Broadcast failed');
    }
  };

  return (
    <div>
      <h2>Send Broadcast</h2>
      <textarea
        rows="4"
        placeholder="Type your announcement to all users"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button onClick={sendBroadcast}>Send Message</button>
      {status && <p>{status}</p>}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default function ChatPage() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chat(input, messages);
      const aiMsg = { role: 'model', text: res.reply };
      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Persist to Firestore
      if (!activeChatId) {
        const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'conversations'), {
          title: input.slice(0, 30) + '...',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          messages: finalMessages
        });
        setActiveChatId(docRef.id);
      } else {
        await updateDoc(doc(db, 'users', currentUser.uid, 'conversations', activeChatId), {
          messages: finalMessages,
          updatedAt: serverTimestamp()
        });
      }
    } catch (err) {
      alert('Error communicating with AI: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex-1 flex flex-col justify-between p-6 max-w-4xl mx-auto w-full">
        <div className="overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl p-4 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'}`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {loading && <div className="text-slate-400 italic">Gemini is thinking...</div>}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ask anything about tech, architecture, or career..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={loading} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

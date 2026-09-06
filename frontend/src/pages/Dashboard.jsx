import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [plansCount, setPlansCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    
    // Fetch recent chats
    const fetchStats = async () => {
      const q = query(
        collection(db, 'users', currentUser.uid, 'conversations'),
        orderBy('updatedAt', 'desc'),
        limit(3)
      );
      const snap = await getDocs(q);
      setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })));

      const plansSnap = await getDocs(collection(db, 'users', currentUser.uid, 'saved_plans'));
      setPlansCount(plansSnap.size);
    };

    fetchStats().catch(console.error);
  }, [currentUser]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-slate-800 text-white p-6 rounded-xl mb-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.email?.split('@')[0]}! 👋</h1>
        <p className="text-slate-300">Ready to boost your tech career today? Here is your system snapshot.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm">Active Conversations</h3>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{chats.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm">Saved Career & Tech Plans</h3>
          <p className="text-3xl font-bold mt-2 text-indigo-600">{plansCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm">Copilot Model</h3>
          <p className="text-2xl font-bold mt-2 text-emerald-600">Gemini 2.5 Flash</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Quick Actions</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/chat" className="p-4 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-lg transition">
          <h4 className="font-semibold text-indigo-900 dark:text-indigo-300">💬 Launch AI Chat</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Multi-turn technical guidance and code assistance.</p>
        </Link>
        <Link to="/career" className="p-4 bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 rounded-lg transition">
          <h4 className="font-semibold text-emerald-900 dark:text-emerald-300">🚀 Build Career Roadmap</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Custom learning paths tailored to target companies.</p>
        </Link>
        <Link to="/project" className="p-4 bg-purple-50 hover:bg-purple-100 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-lg transition">
          <h4 className="font-semibold text-purple-900 dark:text-purple-300">⚡ Generate Project Architecture</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Complete spec with db schemas and deployment plans.</p>
        </Link>
      </div>
    </div>
  );
}

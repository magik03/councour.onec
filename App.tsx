import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from './services/firebase';
import { LEAGUES_DATA } from './constants';
import { Match } from './types';
import MatchListPublic from './components/MatchListPublic';
import AdminMatchCard from './components/AdminMatchCard';

const App: React.FC = () => {
    const [view, setView] = useState<'public' | 'admin'>('public');
    const [user, setUser] = useState<any>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    
    // Auth Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // New Match Form State
    const [league, setLeague] = useState('');
    const [round, setRound] = useState('1'); // Default to 1
    const [home, setHome] = useState('');
    const [away, setAway] = useState('');
    const [homeLogo, setHomeLogo] = useState('');
    const [awayLogo, setAwayLogo] = useState('');
    // Always show form in admin view for smoother UX
    const [showAddForm, setShowAddForm] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const unsubscribeMatches = onSnapshot(collection(db, "matches"), (snapshot) => {
            const ms: Match[] = [];
            snapshot.forEach((doc) => {
                ms.push({ id: doc.id, ...doc.data() } as Match);
            });
            setMatches(ms);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeMatches();
        };
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert("خطأ في الدخول");
        }
    };

    const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setLeague(val);
        setHome('');
        setAway('');
    };

    const handleTeamSelect = (isHome: boolean, teamName: string) => {
        const teamData = LEAGUES_DATA[league] || LEAGUES_DATA['default'];
        const team = teamData.find(t => t.name === teamName);
        const logo = team ? team.logo : '';
        
        if (isHome) {
            setHome(teamName);
            setHomeLogo(logo);
        } else {
            setAway(teamName);
            setAwayLogo(logo);
        }
    };

    const handleAddMatch = async () => {
        if (!league || !home || !away) {
            alert("الرجاء اختيار البطولة والفريقين");
            return;
        }
        
        try {
            await addDoc(collection(db, "matches"), {
                league, round, home, away,
                homeLogo, awayLogo,
                scoreH: 0, scoreA: 0, scorersH: "", scorersA: "",
                status: "لم تبدأ",
                time: 0, isRunning: false, lastStartTime: null
            });
            setHome('');
            setAway('');
            // Keep round or reset? Let's keep it for easy entry of next match in same round
            alert("تم نشر المباراة بنجاح");
        } catch (e) {
            alert("Error adding match");
        }
    };

    // Public Header Component
    const Header = () => (
        <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img 
                        src="https://i.top4top.io/p_3636li6n50.jpg" 
                        alt="Logo" 
                        className="w-10 h-10 rounded-full object-cover border border-emerald-100 shadow-sm"
                    />
                    <div className="hidden md:block">
                        <h1 className="font-bold text-lg leading-none text-emerald-900">Kooora Laghouat</h1>
                        <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Live Score</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Facebook Button */}
                    <a 
                        href="https://www.facebook.com/Kooralghouat" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#1877F2] text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#166fe5] transition shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        <span className="hidden md:inline">تابعنا</span>
                    </a>

                    <button 
                        onClick={() => setView('admin')} 
                        className="text-xs text-gray-500 hover:text-emerald-600 font-medium px-2 py-1 rounded transition"
                    >
                        {user ? 'لوحة التحكم' : 'دخول المشرف'}
                    </button>
                </div>
            </div>
        </header>
    );

    // --- RENDER VIEWS ---

    // 1. Public View
    if (view === 'public') {
        return (
            <div className="min-h-screen bg-gray-50 pb-10">
                <Header />
                <div className="max-w-4xl mx-auto px-4 mt-6">
                     <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        <h2 className="text-xl font-bold text-gray-800">مباريات اليوم</h2>
                     </div>
                    <MatchListPublic matches={matches} />
                </div>
            </div>
        );
    }

    // 2. Admin Login
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-emerald-600 p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <img 
                                src="https://i.top4top.io/p_3636li6n50.jpg" 
                                alt="Logo" 
                                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
                            />
                            <h2 className="text-2xl font-bold text-white">تسجيل الدخول</h2>
                            <p className="text-emerald-100 text-sm mt-1">إدارة النتائج المباشرة</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleLogin} className="p-8 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                            <input 
                                type="email" 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-left" 
                                dir="ltr"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور</label>
                            <input 
                                type="password" 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-left" 
                                dir="ltr"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition shadow-lg transform active:scale-95">
                            دخول آمن
                        </button>
                    </form>
                    <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                         <button onClick={() => setView('public')} className="text-sm text-gray-500 hover:text-emerald-600 font-medium flex items-center justify-center gap-1 mx-auto">
                            <span>←</span> العودة للموقع الرئيسي
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Admin Dashboard
    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-tajawal">
            {/* Admin Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-3 shadow-sm">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-3">
                        <img src="https://i.top4top.io/p_3636li6n50.jpg" className="w-8 h-8 rounded-full border border-gray-200" alt="Logo" />
                        <span>لوحة الإدارة</span>
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => setView('public')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition">
                            الموقع
                        </button>
                        <button onClick={() => signOut(auth)} className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition shadow-sm">
                            خروج
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 mt-8">
                {/* Compact Add Match Form */}
                <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4 mb-8">
                    <h4 className="text-emerald-600 font-bold mb-4 flex items-center gap-2">
                        <span>+</span> إضافة مباراة جديدة
                    </h4>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                             <select 
                                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded text-sm focus:border-emerald-500 outline-none" 
                                value={league} 
                                onChange={handleLeagueChange}
                            >
                                <option value="" disabled>-- اختر البطولة --</option>
                                {Object.keys(LEAGUES_DATA).filter(k => k !== 'default').map(k => (
                                    <option key={k} value={k}>{k}</option>
                                ))}
                                <option value="شرفي الأغواط">شرفي الأغواط</option>
                                <option value="ولائي الأغواط">ولائي الأغواط</option>
                                <option value="كأس الجمهورية">كأس الجمهورية 🏆</option>
                            </select>
                            <select 
                                className="w-1/3 p-2 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-emerald-500"
                                value={round}
                                onChange={e => setRound(e.target.value)}
                            >
                                {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num}>الجولة {num}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3 items-end">
                             <div className="flex-1">
                                <label className="text-[10px] text-gray-400 font-bold mb-1 block">المستضيف</label>
                                <select 
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm outline-none"
                                    value={home}
                                    onChange={(e) => handleTeamSelect(true, e.target.value)}
                                >
                                    <option value="">اختر الفريق</option>
                                    {(LEAGUES_DATA[league] || LEAGUES_DATA['default']).map(t => (
                                        <option key={t.name} value={t.name}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex-1">
                                <label className="text-[10px] text-gray-400 font-bold mb-1 block">الضيف</label>
                                <select 
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm outline-none"
                                    value={away}
                                    onChange={(e) => handleTeamSelect(false, e.target.value)}
                                >
                                    <option value="">اختر الفريق</option>
                                    {(LEAGUES_DATA[league] || LEAGUES_DATA['default']).map(t => (
                                        <option key={t.name} value={t.name}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button 
                                onClick={handleAddMatch}
                                className="w-32 py-2 bg-emerald-500 text-white rounded font-bold hover:bg-emerald-600 shadow-sm transition h-[38px] text-sm"
                            >
                                نشر
                            </button>
                        </div>
                    </div>
                </div>

                {/* Match List */}
                <div className="space-y-4">
                    {matches.map(m => (
                        <AdminMatchCard key={m.id} match={m} />
                    ))}
                    {matches.length === 0 && <div className="text-center text-gray-400 py-10">لا توجد مباريات، أضف واحدة!</div>}
                </div>
            </div>
        </div>
    );
};

export default App;
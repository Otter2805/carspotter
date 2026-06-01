import React, { useState, useEffect } from 'react';
import { MapPin, User, Compass, PlusCircle, ThumbsUp, ThumbsDown, Clock, LogIn } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carImageUrl, setCarImageUrl] = useState('');

  // Check active session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Sign In / Sign Up actions
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      //cSign up user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else if (data.user) {
        // Inject username into our profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, username: username }]);
        
        if (profileError) alert("Profile creation failed: " + profileError.message);
        else alert("Check your email for confirmation!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAddSpot = async (e) => {
  e.preventDefault();
  if (!user) return alert("You must be logged in to spot a car!");
  
  setLoading(true);

  // Quick validation
  if (!carMake || !carModel || !carImageUrl) {
    alert("Please fill out all required fields.");
    setLoading(false);
    return;
  }

  const { error } = await supabase
    .from('spots')
    .insert([
      {
        user_id: user.id,
        make: carMake,
        model: carModel,
        color: carColor,
        image_url: carImageUrl,
        lat: 34.0522,
        lng: -118.2437, 
      }
    ]);

  setLoading(false);

  if (error) {
    alert("Error saving spot: " + error.message);
  } else {
    alert("Car Spotted Successfully!");
    setCarMake('');
    setCarModel('');
    setCarColor('');
    setCarImageUrl('');
    setIsModalOpen(false);
    setActiveTab('feed');
  }
};

  // Mock data for testing feed UI
  const dummySpots = [
    {
      id: 1,
      make: 'Porsche',
      model: '911 GT3 RS',
      color: 'Lizard Green',
      spotter: 'porsche_fanatic',
      time: '12m ago',
      confirms: 4,
      disputes: 0,
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="flex justify-center bg-zinc-950 min-h-screen text-slate-100 antialiased">
      <div className="w-full max-w-md h-screen flex flex-col bg-zinc-900 relative shadow-2xl border-x border-zinc-800">
        
        {/* Top Header */}
        <header className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              RPM_SPOT
            </h1>
          </div>
          <span className="text-[10px] bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full text-zinc-400 font-mono">
            LIVE_FEED
          </span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 pb-24">
          
          {/* MAP TAB */}
          {activeTab === 'map' && (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 relative bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="relative z-10 p-6 flex flex-col items-center">
                <MapPin className="w-8 h-8 mb-4 text-red-500 animate-bounce" />
                <p className="font-bold text-zinc-200">Map Canvas Bound</p>
                <p className="text-xs max-w-xs mt-1 text-zinc-500">Ready for Mapbox GL integration.</p>
              </div>
            </div>
          )}

          {/* EXPLORE FEED TAB */}
          {activeTab === 'feed' && (
            <div className="space-y-4">
              {dummySpots.map((spot) => (
                <div key={spot.id} className="bg-zinc-800/40 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                  <div className="w-full h-56 bg-zinc-950 relative">
                    <img src={spot.image} alt={spot.model} className="w-full h-full object-cover opacity-90" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-lg text-white">{spot.make} {spot.model}</h3>
                    <p className="text-xs text-zinc-400">spotted by <span className="text-red-400">@{spot.spotter}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div>
              {user ? (
                // Authenticated Profile View
                <div className="py-6 flex flex-col items-center">
                  <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-red-500 mb-4">
                    <User className="w-10 h-10 text-zinc-400" />
                  </div>
                  <h2 className="font-black text-xl text-white">Authenticated Driver</h2>
                  <p className="text-xs text-zinc-500 font-mono">{user.email}</p>
                  
                  <button 
                    onClick={handleLogout}
                    className="mt-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold py-2 px-4 rounded-xl border border-zinc-700 transition-all"
                  >
                    Sign Out Account
                  </button>
                </div>
              ) : (
                // Sign In / Sign Up Form View
                <div className="p-4 max-w-sm mx-auto">
                  <div className="text-center mb-6">
                    <LogIn className="w-10 h-10 mx-auto text-red-500 mb-2" />
                    <h2 className="text-xl font-black">{isSignUp ? 'CREATE ACCOUNT' : 'WELCOME BACK'}</h2>
                    <p className="text-xs text-zinc-500 mt-1">Join the network to track & confirm spots.</p>
                  </div>

                  <form onSubmit={handleAuth} className="space-y-3">
                    {isSignUp && (
                      <input 
                        type="text" 
                        placeholder="Unique Username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors"
                      />
                    )}
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                    
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] mt-2 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                  </form>

                  <div className="text-center mt-4">
                    <button 
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-xs text-zinc-400 hover:text-zinc-200 underline underline-offset-4"
                    >
                      {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 h-20 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800/80 flex justify-around items-center px-6 pb-4 z-10">
          <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center gap-1 ${activeTab === 'map' ? 'text-red-500' : 'text-zinc-500'}`}>
            <MapPin className="w-5 h-5" /><span className="text-[10px] font-bold uppercase">Map</span>
          </button>
          <button onClick={() => setActiveTab('feed')} className={`flex flex-col items-center gap-1 ${activeTab === 'feed' ? 'text-red-500' : 'text-zinc-500'}`}>
            <Compass className="w-5 h-5" /><span className="text-[10px] font-bold uppercase">Explore</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center transform -translate-y-2 active:scale-95 transition-transform"
          >
            <div className="p-3.5 bg-gradient-to-tr from-red-600 to-orange-500 rounded-full shadow-lg text-white border-4 border-zinc-900">
              <PlusCircle className="w-6 h-6" />
            </div>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-red-500' : 'text-zinc-500'}`}>
            <User className="w-5 h-5" /><span className="text-[10px] font-bold uppercase">Profile</span>
          </button>
        </nav>

      </div>
      {/* ADD SPOT SLIDE-UP MODAL OVERLAY */}
{isModalOpen && (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
    {/* Click outside container to close */}
    <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
    
    {/* Modal Container sheet */}
    <div className="bg-zinc-900 w-full rounded-t-3xl border-t border-zinc-800 p-6 relative z-10 animate-in slide-in-from-bottom duration-200">
      <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-4" />
      
      {!user ? (
        <div className="text-center py-6">
          <p className="font-bold text-lg text-zinc-200">Authentication Required</p>
          <p className="text-xs text-zinc-500 mt-1 mb-4">You need an active account profile to broadcast live automotive spots.</p>
          <button 
            onClick={() => { setIsModalOpen(false); setActiveTab('profile'); }}
            className="bg-zinc-800 border border-zinc-700 text-zinc-200 px-4 py-2 rounded-xl text-xs font-bold"
          >
            Go to Profile / Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleAddSpot} className="space-y-3.5">
          <h3 className="text-lg font-black tracking-tight text-white uppercase">Log A New Sighting</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text" placeholder="Make (e.g. Ferrari)*" required
              value={carMake} onChange={e => setCarMake(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white"
            />
            <input 
              type="text" placeholder="Model (e.g. 488 Pista)*" required
              value={carModel} onChange={e => setCarModel(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white"
            />
          </div>

          <input 
            type="text" placeholder="Car Color (e.g. Matte Black)" 
            value={carColor} onChange={e => setCarColor(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white"
          />

          <input 
            type="url" placeholder="Image URL (Unsplash or any hosted image link)*" required
            value={carImageUrl} onChange={e => setCarImageUrl(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white font-mono text-xs"
          />

          <div className="flex gap-2 pt-2">
            <button 
              type="button" onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-zinc-800 text-zinc-400 font-bold py-2.5 rounded-xl text-sm transition-colors hover:bg-zinc-750"
            >
              Cancel
            </button>
            <button 
              type="submit" disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-2.5 rounded-xl text-sm shadow-md disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Broadcast Spot'}
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
)
    </div>
  );
}
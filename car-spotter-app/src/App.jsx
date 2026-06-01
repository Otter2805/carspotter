import React, { useState } from 'react';
import { MapPin, User, Compass, PlusCircle, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');

  // Dummy data for testing the UI layout
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
    },
    {
      id: 2,
      make: 'Ferrari',
      model: '488 Pista',
      color: 'Rosso Corsa',
      spotter: 'maranello_built',
      time: '45m ago',
      confirms: 2,
      disputes: 1,
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="flex justify-center bg-zinc-950 min-h-screen text-slate-100 antialiased">
      {/* Mobile Frame Wrapper (Simulates phone on desktop, scales perfectly on actual mobile) */}
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
              {/* Grid background placeholder for map */}
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="relative z-10 p-6 flex flex-col items-center">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-full shadow-xl mb-4 text-red-500">
                  <MapPin className="w-8 h-8 animate-bounce" />
                </div>
                <p className="font-bold text-zinc-200">Map Canvas Bound</p>
                <p className="text-xs max-w-xs mt-1 text-zinc-500">
                  Ready for Mapbox GL integration. Pins will render reactively here based on user bounds.
                </p>
              </div>
            </div>
          )}

          {/* EXPLORE FEED TAB */}
          {activeTab === 'feed' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <p className="text-zinc-400 font-bold text-sm tracking-wide uppercase">Active Hot-Spots</p>
                <span className="text-xs text-zinc-500 font-medium">Within 10 mi</span>
              </div>

              {dummySpots.map((spot) => (
                <div key={spot.id} className="bg-zinc-800/40 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-lg">
                  {/* Image wrapper */}
                  <div className="w-full h-56 bg-zinc-950 relative">
                    <img src={spot.image} alt={spot.model} className="w-full h-full object-cover opacity-90" />
                    <div className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 text-xs text-zinc-300 border border-zinc-700/50">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      <span>{spot.time}</span>
                    </div>
                  </div>
                  
                  {/* Content details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-lg tracking-tight text-white">{spot.make} {spot.model}</h3>
                        <p className="text-xs text-zinc-400 font-medium">{spot.color} • spotted by <span className="text-red-400 font-semibold">@{spot.spotter}</span></p>
                      </div>
                    </div>

                    {/* Verification Mechanics UI */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-medium">Is it still there?</span>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 transition-all font-semibold active:scale-95">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{spot.confirms}</span>
                        </button>
                        <button className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-xl border border-red-500/20 transition-all font-semibold active:scale-95">
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>{spot.disputes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="py-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-red-600 to-orange-500 rounded-full p-0.5 shadow-xl mb-4">
                <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center border-4 border-zinc-900">
                  <User className="w-10 h-10 text-zinc-400" />
                </div>
              </div>
              <h2 className="font-black text-xl tracking-tight text-white">Alex Otter</h2>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">@otter_spots</p>

              {/* Profile stats breakdown */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-xs mt-6 py-3 border-y border-zinc-800/80 text-center">
                <div>
                  <p className="font-black text-lg text-white">42</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Spots</p>
                </div>
                <div>
                  <p className="font-black text-lg text-white">1.2k</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Followers</p>
                </div>
                <div>
                  <p className="font-black text-lg text-white">180</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Following</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 h-20 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800/80 flex justify-around items-center px-6 pb-4 z-10">
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'map' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-400'}`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-wide uppercase">Map</span>
          </button>

          <button 
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'feed' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-400'}`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-wide uppercase">Explore</span>
          </button>

          {/* Action Trigger for camera capture logic later */}
          <button className="flex flex-col items-center transform -translate-y-2 active:scale-95 transition-transform">
            <div className="p-3.5 bg-gradient-to-tr from-red-600 to-orange-500 rounded-full shadow-lg text-white border-4 border-zinc-900">
              <PlusCircle className="w-6 h-6" />
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-400'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-wide uppercase">Profile</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
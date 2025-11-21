import React, { useState, useCallback } from 'react';
import { Search, Shield, Database, ExternalLink, ChevronDown, ChevronUp, Sparkles, Plane, Flag, GraduationCap, History } from 'lucide-react';
import { generatePlayerCard } from './services/geminiService';
import FootballCard from './components/FootballCard';
import StatRadar from './components/StatRadar';
import { PlayerCardData, SearchState } from './types';
import { ATTRIBUTE_CATEGORIES, INITIAL_PLAYER_DATA } from './constants';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    data: null,
    error: null,
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleSearch = useCallback(async (e?: React.FormEvent, queryOverride?: string) => {
    if (e) e.preventDefault();
    const query = queryOverride || searchQuery;
    if (!query.trim()) return;

    if (queryOverride) setSearchQuery(queryOverride);

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    setExpandedCategory(null); // Ensure collapsed on new search

    try {
      const data = await generatePlayerCard(query);
      setState({ isLoading: false, data, error: null });
    } catch (error) {
      setState({ 
        isLoading: false, 
        data: null, 
        error: "Could not scout this player. Try adding a year (e.g. 'Rooney 2008')." 
      });
    }
  }, [searchQuery]);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const activeData = state.data;
  const hasData = !!activeData;

  return (
    <div className="min-h-screen bg-hex-pattern bg-fixed text-gray-100 font-sans selection:bg-gold-500 selection:text-black flex flex-col">
      
      {/* Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${hasData ? 'bg-card-dark/90 backdrop-blur-lg border-b border-gray-800 shadow-lg' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setState({data:null, isLoading:false, error:null}); setSearchQuery(''); }}>
            <Shield className="text-gold-500 fill-gold-500/20" size={28} />
            <div>
              <h1 className="text-xl font-display font-bold tracking-wider text-white">SCOUT<span className="text-gold-500">AI</span></h1>
            </div>
          </div>
          
          {/* Compact Search Bar (Visible only when results exist) */}
          {hasData && (
             <form onSubmit={(e) => handleSearch(e)} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative group w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scout another player..."
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                  disabled={state.isLoading}
                />
                <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-gold-500" size={16} />
              </div>
            </form>
          )}

          <div className="flex items-center gap-4">
             <a href="#" className="text-xs font-mono text-gray-500 hover:text-gold-500 transition-colors">V2.1</a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`flex-grow max-w-7xl mx-auto px-4 w-full transition-all duration-500 ${hasData ? 'pt-24 pb-12' : 'flex items-center justify-center'}`}>
        
        {/* Error Message */}
        {state.error && (
           <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 bg-red-900/90 border border-red-500/50 rounded-lg text-red-100 text-sm shadow-xl backdrop-blur-sm animate-bounce">
             {state.error}
           </div>
        )}

        {/* HERO SECTION (No Data) */}
        {!hasData && !state.isLoading && (
          <div className="flex flex-col items-center justify-center w-full max-w-2xl text-center space-y-8 animate-fadeIn">
            <div className="relative">
               <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
               <div className="relative p-6 rounded-full bg-card-dark border border-gray-800 shadow-2xl">
                 <Database size={48} className="text-gold-500" />
               </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                Next Gen Scouting
              </h2>
              <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
                Leverage Gemini AI to analyze <span className="text-gold-400 font-semibold">FBRef</span> & <span className="text-gold-400 font-semibold">Wikipedia</span> data for deep career history and authentic stats.
              </p>
            </div>

            <form onSubmit={(e) => handleSearch(e)} className="w-full max-w-lg relative">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Lamine Yamal, Zidane 2002, Buffon..."
                  className="w-full h-14 bg-gray-900/80 backdrop-blur-xl text-white border border-gray-700 rounded-2xl pl-12 pr-4 text-lg shadow-2xl focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all placeholder:text-gray-600"
                />
                <Search className="absolute left-4 top-4 text-gray-500 group-focus-within:text-gold-500 transition-colors" size={24} />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-4 bg-gold-500 hover:bg-gold-400 text-black font-bold rounded-xl transition-all active:scale-95 flex items-center gap-2"
                >
                  Scout
                </button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <span className="text-xs text-gray-600 uppercase font-bold tracking-widest py-1">Trending:</span>
              <button onClick={() => handleSearch(undefined, "Bellingham Real Madrid")} className="px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 border border-gray-700 transition hover:text-gold-400">Bellingham</button>
              <button onClick={() => handleSearch(undefined, "Ronaldinho 2005")} className="px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 border border-gray-700 transition hover:text-gold-400">Ronaldinho '05</button>
              <button onClick={() => handleSearch(undefined, "Neuer 2014")} className="px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 border border-gray-700 transition hover:text-gold-400">Neuer '14</button>
            </div>
          </div>
        )}

        {/* RESULTS SECTION */}
        {(hasData || state.isLoading) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn w-full">
            
            {/* Left Column: The Card & Info */}
            <div className="lg:col-span-4 flex flex-col items-center space-y-6 sticky top-24 h-fit">
              <FootballCard data={activeData || INITIAL_PLAYER_DATA} loading={state.isLoading} />
              
              {!state.isLoading && activeData && (
                <div className="w-full max-w-[320px] bg-card-dark/50 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gold-500/50"></div>
                  <div className="flex items-center gap-2 mb-4">
                     <Sparkles className="text-gold-400" size={18} />
                     <h3 className="text-white font-display text-lg tracking-wide">Scout Report</h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed italic font-light">
                    "{activeData.description}"
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 tracking-wider">Verified Sources</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeData.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-gold-400 hover:border-gold-500/30 transition-all truncate max-w-full group-hover:shadow-lg"
                        >
                          <ExternalLink size={10} />
                          <span className="truncate max-w-[180px]">{source.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Detailed Stats */}
            <div className="lg:col-span-8 space-y-6">
               {state.isLoading ? (
                 <div className="h-96 flex flex-col items-center justify-center space-y-4 text-gray-500 border border-gray-800 rounded-2xl bg-card-dark/30">
                    <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full"></div>
                    <p className="font-mono text-sm animate-pulse">Gathering comprehensive career data...</p>
                 </div>
               ) : activeData && (
                 <>
                  {/* Radar & Bio */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card-dark/50 backdrop-blur p-6 rounded-2xl border border-gray-800 shadow-xl">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-white font-display text-xl tracking-wide">Performance Profile</h3>
                          <span className="text-xs font-mono text-gold-500 bg-gold-500/10 px-2 py-1 rounded">PER 90 STATS</span>
                       </div>
                       <StatRadar stats={activeData.faceStats} position={activeData.position} />
                    </div>

                    <div className="bg-card-dark/50 backdrop-blur p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-center relative overflow-hidden">
                       <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl"></div>
                       
                       <div className="space-y-5 relative z-10">
                          <div className="flex justify-between items-center border-b border-gray-800 pb-3 group cursor-default">
                             <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Club</span>
                             <span className="font-bold text-white text-lg group-hover:text-gold-400 transition-colors text-right">{activeData.club}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-gray-800 pb-3 group cursor-default">
                             <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Nation</span>
                             <span className="font-bold text-white text-lg group-hover:text-gold-400 transition-colors text-right">{activeData.nation}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-gray-800 pb-3 group cursor-default">
                             <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">League</span>
                             <span className="font-bold text-white text-lg group-hover:text-gold-400 transition-colors text-right">{activeData.league}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                             <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Position</span>
                             <span className="px-3 py-1 bg-gold-500 text-black rounded-md font-display font-bold shadow-lg shadow-gold-500/20">{activeData.position}</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Career Journey Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* History Column 1: Transfers */}
                    <div className="bg-card-dark/50 backdrop-blur p-6 rounded-2xl border border-gray-800 shadow-xl">
                      <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-2">
                        <Plane className="text-gold-500" size={20} />
                        <h3 className="text-white font-display text-xl tracking-wide">Transfer History</h3>
                      </div>
                      <div className="space-y-4 relative">
                        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-800"></div>
                         {activeData.transferHistory && activeData.transferHistory.length > 0 ? (
                            activeData.transferHistory.map((transfer, idx) => (
                              <div key={idx} className="relative pl-6 group">
                                <div className="absolute left-0 top-2 w-2.5 h-2.5 bg-gray-800 rounded-full border-2 border-card-bg group-hover:bg-gold-500 transition-colors z-10"></div>
                                <div className="flex justify-between items-baseline">
                                  <span className="text-white font-bold text-sm">{transfer.club}</span>
                                  <span className="text-gold-500 font-mono text-xs">{transfer.season}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">{transfer.fee}</div>
                              </div>
                            ))
                         ) : (
                           <p className="text-sm text-gray-500 italic pl-6">No major transfers found.</p>
                         )}
                      </div>
                    </div>

                    {/* History Column 2: International & Youth */}
                    <div className="space-y-6">
                        {/* International */}
                        <div className="bg-card-dark/50 backdrop-blur p-6 rounded-2xl border border-gray-800 shadow-xl">
                          <div className="flex items-center gap-3 mb-4 border-b border-gray-800 pb-2">
                             <Flag className="text-gold-500" size={20} />
                             <h3 className="text-white font-display text-xl tracking-wide">International</h3>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-gray-400 text-sm">Nation</span>
                             <span className="text-white font-bold">{activeData.internationalHistory.nation}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-gray-400 text-sm">Caps / Goals</span>
                             <span className="text-gold-500 font-mono font-bold">
                               {activeData.internationalHistory.caps} / {activeData.internationalHistory.goals}
                             </span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-gray-400 text-sm">Active</span>
                             <span className="text-gray-300 text-xs">{activeData.internationalHistory.years}</span>
                          </div>
                        </div>

                         {/* Youth */}
                        <div className="bg-card-dark/50 backdrop-blur p-6 rounded-2xl border border-gray-800 shadow-xl">
                          <div className="flex items-center gap-3 mb-4 border-b border-gray-800 pb-2">
                             <GraduationCap className="text-gold-500" size={20} />
                             <h3 className="text-white font-display text-xl tracking-wide">Youth Academy</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {activeData.youthCareer && activeData.youthCareer.length > 0 ? (
                              activeData.youthCareer.map((club, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 border border-gray-700">
                                  {club}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500 italic">No youth data available.</span>
                            )}
                          </div>
                        </div>
                    </div>
                  </div>

                  {/* Detailed Attributes Accordion */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-display text-white tracking-wide">Detailed Attributes</h3>
                        <div className="h-px flex-1 bg-gray-800"></div>
                    </div>
                    
                    {Object.entries(ATTRIBUTE_CATEGORIES).map(([category, attrs]) => {
                      // If GK, hide outfield categories and vice versa (optional, but keeps it clean)
                      if (activeData.position === 'GK' && category !== 'Goalkeeping' && category !== 'Physical' && category !== 'Passing') {
                          // Optional filtering
                      }

                      const isOpen = expandedCategory === category;
                      
                      // Calculate average
                      const catValues = attrs.map(key => (activeData.attributes as any)[key] || 0);
                      const avg = Math.round(catValues.reduce((a, b) => a + b, 0) / catValues.length);
                      
                      // Styles based on avg
                      let pillStyle = "bg-gray-800 text-gray-400 border-gray-700";
                      if (avg >= 85) pillStyle = "bg-green-900/30 text-green-400 border-green-800";
                      else if (avg >= 75) pillStyle = "bg-yellow-900/30 text-yellow-400 border-yellow-800";

                      return (
                        <div key={category} className={`rounded-xl border ${isOpen ? 'border-gold-500/30 bg-card-dark' : 'border-gray-800 bg-card-dark/50'} overflow-hidden transition-all duration-300`}>
                          <button 
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border ${pillStyle} transition-colors duration-300`}>
                                {avg}
                              </div>
                              <span className={`font-display font-semibold text-lg tracking-wide ${isOpen ? 'text-white' : 'text-gray-400'}`}>{category}</span>
                            </div>
                            {isOpen ? <ChevronUp size={20} className="text-gold-500" /> : <ChevronDown size={20} className="text-gray-600" />}
                          </button>
                          
                          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {attrs.map((attrKey) => {
                                const value = (activeData.attributes as any)[attrKey];
                                let valColor = "text-gray-500";
                                let barColor = "bg-gray-700";
                                
                                if (value >= 90) { valColor = "text-green-400"; barColor = "bg-green-500"; }
                                else if (value >= 80) { valColor = "text-green-500"; barColor = "bg-green-600/80"; }
                                else if (value >= 70) { valColor = "text-yellow-500"; barColor = "bg-yellow-600/80"; }
                                else if (value < 60) { valColor = "text-red-500"; barColor = "bg-red-900"; }

                                return (
                                  <div key={attrKey} className="flex flex-col space-y-1 p-2 rounded hover:bg-gray-800/50 transition-colors">
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-gray-300 capitalize tracking-tight">{attrKey.replace(/([A-Z])/g, ' $1').replace(/^gk\s/i, '').trim()}</span>
                                      <span className={`font-mono font-bold ${valColor}`}>{value}</span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                       <div className={`h-full rounded-full ${barColor}`} style={{ width: `${value}%` }}></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                 </>
               )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
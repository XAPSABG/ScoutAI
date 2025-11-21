import React, { useState, useEffect } from 'react';
import { PlayerCardData } from '../types';
import { User, ShieldCheck, Globe, Award } from 'lucide-react';

interface FootballCardProps {
  data: PlayerCardData;
  loading: boolean;
}

const FootballCard: React.FC<FootballCardProps> = ({ data, loading }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [data.image, data.name]);

  // Determine card aesthetics based on rating
  const getCardStyle = (rating: number) => {
    if (rating >= 90) {
      return {
        bg: "bg-gradient-to-b from-blue-900 via-indigo-900 to-black",
        border: "border-yellow-400",
        text: "text-yellow-100",
        accent: "text-yellow-400",
        shine: "opacity-60"
      }; // TOTY / Special
    }
    if (rating >= 80) {
      return {
        bg: "bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700",
        border: "border-yellow-300",
        text: "text-gray-900",
        accent: "text-gray-900",
        shine: "opacity-40"
      }; // Gold Rare
    }
    if (rating >= 75) {
      return {
        bg: "bg-gradient-to-b from-gray-200 via-gray-400 to-gray-500",
        border: "border-gray-300",
        text: "text-gray-900",
        accent: "text-gray-900",
        shine: "opacity-30"
      }; // Silver Rare
    }
    return {
      bg: "bg-gradient-to-b from-orange-200 via-orange-400 to-orange-700",
      border: "border-orange-300",
      text: "text-gray-900",
      accent: "text-gray-900",
      shine: "opacity-20"
    }; // Bronze Rare
  };

  const style = getCardStyle(data.overallRating || 75);
  const isGK = data.position === 'GK';

  if (loading) {
    return (
      <div className="relative w-[320px] h-[480px] mx-auto">
        <div className="absolute inset-0 bg-gray-900 rounded-[2rem] border-4 border-gray-800 animate-pulse overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-700 opacity-50"></div>
           <div className="flex flex-col items-center justify-center h-full space-y-4">
             <div className="w-20 h-20 rounded-full bg-gray-800 animate-bounce flex items-center justify-center">
                <Award className="text-gold-500 opacity-50" size={40} />
             </div>
             <div className="text-gold-500 font-display text-xl tracking-widest animate-pulse">SCOUTING...</div>
             <div className="text-xs text-gray-500 font-mono">Scanning FBRef & Wikipedia</div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group perspective-1000 w-[320px] mx-auto">
      {/* Outer Container for Hover Effects */}
      <div className="relative w-full h-[480px] transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-1">
        
        {/* Main Card Shape */}
        <div className={`absolute inset-0 ${style.bg} rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[6px] ${style.border} overflow-hidden`}>
          
          {/* Pattern Texture */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-multiply"></div>

          {/* Shine Animation */}
          <div className={`absolute inset-0 card-shine ${style.shine} pointer-events-none z-20`}></div>

          {/* Content Layout */}
          <div className="relative z-10 h-full flex flex-col text-gray-900">
            
            {/* Top Header: Rating & Position */}
            <div className="absolute top-6 left-6 flex flex-col items-center z-30">
              <span className={`text-5xl font-display font-bold leading-none ${style.text} drop-shadow-md`}>
                {data.overallRating}
              </span>
              <span className={`text-xl font-display font-bold uppercase tracking-wider ${style.text} opacity-90`}>
                {data.position}
              </span>
              
              <div className={`w-10 h-0.5 my-2 ${data.overallRating >= 90 ? 'bg-yellow-400' : 'bg-gray-800'} opacity-50`}></div>

              {/* Nation & Club (Icons/Text) */}
              <div className="flex flex-col items-center gap-2 mt-1">
                <div className="w-8 h-6 bg-gradient-to-r from-gray-700 to-gray-900 rounded-sm flex items-center justify-center border border-white/20 shadow-sm" title={data.nation}>
                   <span className="text-[10px] font-bold text-white truncate px-1">{data.nation.substring(0,3).toUpperCase()}</span>
                </div>
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md border border-gray-300" title={data.club}>
                   <ShieldCheck size={18} className="text-gray-800" />
                </div>
              </div>
            </div>

            {/* Player Image Area */}
            <div className="absolute top-4 right-4 left-10 bottom-40 pointer-events-none z-20">
               <div className="w-full h-full flex items-end justify-center relative">
                   {data.image && !imgError ? (
                     <img 
                       src={data.image} 
                       alt={data.name} 
                       className="w-full h-full object-contain drop-shadow-2xl"
                       style={{ 
                         maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                         WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' 
                       }}
                       onError={() => setImgError(true)}
                     />
                   ) : (
                     <div className="flex items-end justify-center w-full h-full opacity-60">
                        <User 
                            className={`w-48 h-48 ${data.overallRating >= 90 ? 'text-yellow-100' : 'text-gray-900'} drop-shadow-2xl filter`} 
                            strokeWidth={1} 
                            fill="currentColor"
                            fillOpacity={0.2}
                        />
                     </div>
                   )}
               </div>
            </div>

            {/* Name Plate */}
            <div className="absolute bottom-[155px] left-0 right-0 text-center z-30">
               <div className="mx-4 py-1 border-b-2 border-t-2 border-black/10 bg-gradient-to-r from-transparent via-black/5 to-transparent">
                 <h2 className={`text-2xl font-display font-bold uppercase tracking-wider truncate px-2 ${style.text} text-shadow-sm`}>
                    {data.name}
                 </h2>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="absolute bottom-0 left-0 right-0 h-[150px] px-6 py-4 z-30">
              {/* Divider Line */}
              <div className="flex items-center gap-2 justify-center mb-3 opacity-60">
                  <div className={`h-px w-12 ${data.overallRating >= 90 ? 'bg-yellow-200' : 'bg-gray-800'}`}></div>
                  <Globe size={12} className={style.text} />
                  <div className={`h-px w-12 ${data.overallRating >= 90 ? 'bg-yellow-200' : 'bg-gray-800'}`}></div>
              </div>

              <div className={`grid grid-cols-2 gap-x-8 gap-y-1 font-display ${style.text}`}>
                 {isGK ? (
                   <>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">DIV</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.div}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">REF</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.ref}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">HAN</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.han}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">SPD</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.spd}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">KIC</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.kic}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">POS</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.pos}</span>
                     </div>
                   </>
                 ) : (
                   <>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">PAC</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.pac}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">DRI</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.dri}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">SHO</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.sho}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">DEF</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.def}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">PAS</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.pas}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-black/5 pb-1">
                       <span className="font-medium text-sm uppercase opacity-70">PHY</span>
                       <span className="font-bold text-xl leading-none">{data.faceStats.phy}</span>
                     </div>
                   </>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FootballCard;
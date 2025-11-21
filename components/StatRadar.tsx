import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { FaceStats } from '../types';

interface StatRadarProps {
  stats: FaceStats;
  position: string;
}

const StatRadar: React.FC<StatRadarProps> = ({ stats, position }) => {
  const isGK = position === 'GK';

  const data = isGK ? [
    { subject: 'DIV', A: stats.div || 0, fullMark: 100 },
    { subject: 'HAN', A: stats.han || 0, fullMark: 100 },
    { subject: 'KIC', A: stats.kic || 0, fullMark: 100 },
    { subject: 'REF', A: stats.ref || 0, fullMark: 100 },
    { subject: 'SPD', A: stats.spd || 0, fullMark: 100 },
    { subject: 'POS', A: stats.pos || 0, fullMark: 100 },
  ] : [
    { subject: 'PAC', A: stats.pac, fullMark: 100 },
    { subject: 'SHO', A: stats.sho, fullMark: 100 },
    { subject: 'PAS', A: stats.pas, fullMark: 100 },
    { subject: 'DRI', A: stats.dri, fullMark: 100 },
    { subject: 'DEF', A: stats.def, fullMark: 100 },
    { subject: 'PHY', A: stats.phy, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#333" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600, fontFamily: 'Oswald' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Player"
            dataKey="A"
            stroke="#D4A523"
            strokeWidth={3}
            fill="#D4A523"
            fillOpacity={0.5}
            isAnimationActive={true}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatRadar;
import React from 'react';

interface UzbekPlateProps {
  plate: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UzbekPlate: React.FC<UzbekPlateProps> = ({
  plate,
  className = '',
  size = 'md',
}) => {
  // Parse format like "01 A 777 AA" or "01 777 AAA"
  const parts = plate.trim().split(' ');
  const region = parts[0] || '01';
  const rest = parts.slice(1).join(' ') || plate;

  const sizeClasses = {
    sm: 'text-xs h-6 px-1.5 gap-1',
    md: 'text-sm h-8 px-2.5 gap-2',
    lg: 'text-base h-10 px-3.5 gap-2.5',
  };

  const regionClasses = {
    sm: 'text-[10px] pr-1',
    md: 'text-xs pr-1.5',
    lg: 'text-sm pr-2',
  };

  return (
    <div
      className={`inline-flex items-center bg-white border-2 border-slate-900 rounded-md font-mono font-bold tracking-wider text-slate-900 shadow-xs select-none ${sizeClasses[size]} ${className}`}
      style={{ letterSpacing: '0.08em' }}
    >
      <div className={`flex items-center gap-1 border-r border-slate-300 ${regionClasses[size]}`}>
        <span>{region}</span>
        <div className="w-2.5 h-1.5 flex flex-col rounded-[1px] overflow-hidden border border-slate-400">
          <span className="h-1/3 bg-[#1EB53A] w-full" />
          <span className="h-1/3 bg-white w-full" />
          <span className="h-1/3 bg-[#0099B5] w-full" />
        </div>
      </div>
      <span className="uppercase">{rest}</span>
    </div>
  );
};

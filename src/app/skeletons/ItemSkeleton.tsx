import React from 'react';

const ItemSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[14rem] h-[13rem] max-sm:w-[9rem] max-sm:h-[10rem] rounded-md bg-gray-200 animate-pulse" />
      <div className="w-[10rem] h-[1rem] max-sm:w-[8rem] rounded-md bg-gray-200 animate-pulse" />
      <div className="w-[5rem] h-[1rem] rounded-md bg-gray-200 animate-pulse" />
      <div className="w-[9rem] h-[1rem] max-sm:w-[7rem] rounded-md bg-gray-200 animate-pulse" />
    </div>
  );
};

export const ItemSkeleton2: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[14rem] h-[13rem] max-sm:h-[10rem] max-sm:w-[9rem] rounded-md bg-gray-200 animate-pulse" />
      <div className="w-[10rem] h-[1rem] max-sm:w-[8rem] rounded-md bg-gray-200 animate-pulse" />
      <div className="w-[11rem] h-[1rem] max-sm:w-[9rem] rounded-md bg-gray-200 animate-pulse" />
    </div>
  );
};

export default ItemSkeleton;

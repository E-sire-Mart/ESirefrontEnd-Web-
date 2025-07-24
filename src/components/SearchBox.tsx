import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBoxProps {
  onSearch: (text: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchText);
    }
  };

  return (
    <div className="_searchbox">
      <FiSearch
        className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400"
        size={24}
      />
      <input
        type="text"
        placeholder="Search for products"
        className="outline-none w-full text-[14px]"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBox;

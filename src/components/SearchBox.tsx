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
    <div className="relative">
      <FiSearch
        className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 dark:text-gray-500"
        size={20}
      />
      <input
        type="text"
        placeholder="Search for products"
        className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBox;

import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="relative flex-grow">
    <input
      type="text"
      className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      placeholder="Search questions..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search size={18} className="text-gray-400" />
    </div>
  </div>
);

export default SearchBar;

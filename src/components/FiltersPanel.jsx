const FiltersPanel = ({
    showFilters,
    categories,
    categoryFilter,
    setCategoryFilter,
    difficulties,
    difficultyFilter,
    setDifficultyFilter,
    types,
    typeFilter,
    setTypeFilter
  }) => {
    if (!showFilters) return null;
  
    return (
      <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-64">
        <div className="p-4">
          <div className="mb-4">
            <label className="font-medium mb-1 block">Category</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
  
          <div className="mb-4">
            <label className="font-medium mb-1 block">Difficulty</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
  
          <div className="mb-4">
            <label className="font-medium mb-1 block">Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };
  
  export default FiltersPanel;
  
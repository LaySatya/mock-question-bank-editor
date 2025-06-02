// components/questions/components/TextEditor.jsx
const TextEditor = ({ value, onChange, placeholder, error, minHeight = "80px" }) => (
  <div className="border border-gray-300 rounded-md">
    {/* Toolbar */}
    <div className="border-b border-gray-200 p-2 flex items-center gap-1 bg-gray-50">
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">¶</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm font-bold">B</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm italic">I</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm underline">U</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">A</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">🔤</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">⋯</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">🔗</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">🖼️</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">🎥</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">📁</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">
        <img src="src/assets/icon_text/H5p.svg" className="w-6 h-6" alt="icon" />
      </button>
    </div>
    <textarea
      className={`w-full px-3 py-2 border-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : ''
      }`}
      style={{ minHeight }}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);
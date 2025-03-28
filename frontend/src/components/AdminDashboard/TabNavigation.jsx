const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <nav className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap focus:outline-none ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id} >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default TabNavigation
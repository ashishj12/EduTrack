const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-6 space-y-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
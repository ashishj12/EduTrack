const ActionCard = ({ action, onClick }) => {
  return (
    <div className={`${action.bgColor} rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer mx-2 sm:mx-4 mb-4 sm:mb-0 w-full sm:max-w-xs`}
      onClick={onClick} >
      <div
        className={`${action.iconBgColor} w-10 h-10 rounded-lg flex items-center justify-center mb-3`} >
        {action.icon}
      </div>

      <h3 className="font-semibold text-gray-800 text-base">{action.title}</h3>
      <p className="text-xs sm:text-sm text-gray-600">{action.description}</p>
    </div>
  );
};

export default ActionCard;
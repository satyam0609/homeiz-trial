const ActionButton = ({
  icon: Icon,
  count,
  onClick,
}: {
  icon: any;
  count: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 rounded-md transition-all 
                 hover:bg-gray-100 hover:text-blue-600 
                 active:scale-95"
    >
      <Icon size={18} />
      <span className="text-base font-semibold">{count}</span>
    </button>
  );
};

export default ActionButton;



interface TopBarProps {
  title: string;
}

const TopBar = ({ title }: TopBarProps) => {
  return (
    <div className="border-b p-4 border-stone-300 flex relative bg-[] items-center">
      <h2 className="text-center text-lg font-bold block p-2 text-[#173F51] ">
        {title}
      </h2>
    </div>
  );
};

export default TopBar;

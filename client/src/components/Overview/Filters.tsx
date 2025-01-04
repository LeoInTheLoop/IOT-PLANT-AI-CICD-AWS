interface FilterCounts {
  total: number;
  normal: number;
  warning: number;
}

interface Props {
  counts: FilterCounts;
}

const Filter = ({ counts }: Props) => {
  return (
    <div className="grid grid-cols-3 px-4 py-4 gap-4 w-full">
      <div className="p-4 rounded-lg text-[#173F51] bg-[#d4eaf7] shadow-lg">
        <p className="text-xl">{counts.total}</p>
        <p className="text-sm text-gray-500">Total Devices</p>
      </div>

      <div className="p-4 rounded-lg text-[#173F51] bg-[#d4eaf7] shadow-lg">
        <p className="text-xl">{counts.normal}</p>
        <p className="text-sm text-gray-500">Normal Devices</p>
      </div>

      <div className="p-4 rounded-lg text-[#173F51] bg-[#d4eaf7] shadow-lg">
        <p className="text-xl">{counts.warning}</p>
        <p className="text-sm text-gray-500">Warning Devices</p>
      </div>
    </div>
  );
};

export default Filter;

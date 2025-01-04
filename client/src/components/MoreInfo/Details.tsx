import { useParams } from "react-router-dom";
import TopBar from "../Navigation/TopBar";
import MachineChart from "./MachineChart";

const Details = () => {
  const { machine_id } = useParams();

  return (
    <div className="bg-[#fffefb] rounded-lg pb-4 shadow h-full min-h-screen">
      <TopBar title={`Historical statistics / Machine：${machine_id}`} />
      {/* change this to More Info / :machine_id */}

      <MachineChart />
    </div>
  );
};

export default Details;

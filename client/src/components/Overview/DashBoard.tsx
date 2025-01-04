import TopBar from "../Navigation/TopBar";
import MachineList from "./MachineList";

const DashBoard = () => {
  return (
    <div className="bg-[#fffefb] rounded-lg pb-10 shadow h-full min-h-screen">
      {" "}
      <TopBar title="Machine List" />
      {/* change this to More Info / :machine_id */}'
      <MachineList />
    </div>
  );
};

export default DashBoard;

import TopBar from "../Navigation/TopBar";
import MachineList from "./MachineList";

const DashBoard = () => {
  return (
    <div className="bg-[#fffefb] rounded-lg pb-10 shadow h-full min-h-screen">
      {" "}
      <TopBar title="Machine List ahaha" />
      <MachineList />
    </div>
  );
};

export default DashBoard;

import DashBoard from "../components/Overview/DashBoard";
import SideMenu from "../components/SideMenu/SideMenu";

const Overview = () => {
  return (
    <div className=" bg-[#f5f4f1] gap-4 p-4 grid grid-cols-[200px,_1fr]">
      <SideMenu />
      <DashBoard />
    </div>
  );
};

export default Overview;

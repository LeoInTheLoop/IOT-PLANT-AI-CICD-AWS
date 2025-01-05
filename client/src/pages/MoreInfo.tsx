
import Details from "../components/MoreInfo/Details";
import SideMenu from "../components/SideMenu/SideMenu";

const MoreInfo = () => {
  return (
    <div className=" bg-[#f5f4f1] gap-4 p-4 grid grid-cols-[200px,_1fr]">
      <SideMenu />
      <Details />
    </div>
  );
};

export default MoreInfo;

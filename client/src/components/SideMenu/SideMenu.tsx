import React from "react";
import Selection from "./Selection";
import dashboardIcon from "../../assets/nav-icon.png"; // 导入图片

const SideMenu = () => {
  return (
    <div className=" p-3 sticky top-4">
      {/* Dashboard Icon */}
      <span className="border-b pb-4 border-stone-300 flex relative w-full block items-center">
        <img
          src={dashboardIcon}
          alt="Dashboard Icon"
          className="size-12 p-1 rounded shrink-0 "
        />
        <p className="text-center text-lg font-bold block text-[#173F51]">
          DASHBOARD
        </p>
      </span>
      <Selection />
    </div>
  );
};

export default SideMenu;

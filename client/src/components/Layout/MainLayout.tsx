import SideMenu from "../SideMenu/SideMenu";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="bg-[#f5f4f1] gap-4 p-4 grid grid-cols-[200px,_1fr]">
      <SideMenu />
      {children}
    </div>
  );
};

export default MainLayout; 
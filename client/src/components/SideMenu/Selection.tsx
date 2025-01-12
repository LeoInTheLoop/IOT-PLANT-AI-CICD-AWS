import { useLocation } from "react-router-dom";

const Route = ({
  selected,
  title,
}: // onClick,
{
  selected: boolean;
  title: string;
  // onClick: () => void;
}) => {
  return (
    <div>
      <button
        // the style when selected is true
        className={`block w-full  items-center px-6 py-6 text-g font-bold text-[#173F51]rounded-lg ${
          selected ? "bg-[#d4eaf7] text-[#173F51]" : "text-[#173F51]"
        }`}
        // onClick={onClick}
      >
        {title}
      </button>
    </div>
  );
};

const Selection = () => {
  // const [selected, setSelected] = React.useState("");
  const location = useLocation();
  const path = location.pathname;

  // Sets the path used to determine if the style should be applied
  const isOverviewSelected = path === "/";
  const isMoreInfoSelected = path.includes("/detail");

  return (
    <div>
      <Route
        selected={isOverviewSelected}
        title="OVERVIEW"
        // onClick={() => setSelected("true")}
      />
      <Route
        selected={isMoreInfoSelected}
        title="MORE INFO"
        // onClick={() => setSelected("true")}
      />
    </div>
  );
};

export default Selection;

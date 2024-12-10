import Navigation from ".././components/Navigation.tsx";
import { Link } from "react-router-dom";
import MachineCard from "../components/Machine.tsx";

const MachineList = () => {
  return (
    <div>
      <Navigation />

      <p> use this page to should overal machine status </p>
 
      <Link to="/" className="text-purple-800 underline"></Link>

      <MachineCard
        Machinename="machinename 1"
        id="1"
        ProductType="Type A"
        airtemp={parseFloat("25.5")} // Example: converting string to number
        processtemp={parseFloat("30")}
        Rotationalspeed={parseInt("1500", 10)}
        torque={parseFloat("20.5")}
        toolwearinmins={parseInt("50", 10)}
        status="On"
        temp={parseFloat("75")}
        conversionRate={parseFloat("-15.2")}
      />

       <MachineCard
        Machinename="machinename 2"
        id="2"
        ProductType="Type b"
        airtemp={parseFloat("25.5")} // Example: converting string to number
        processtemp={parseFloat("500")}
        Rotationalspeed={parseInt("1500", 10)}
        torque={parseFloat("20.5")}
        toolwearinmins={parseInt("50", 10)}
        status="Off"
        temp={parseFloat("75")}
        conversionRate={parseFloat("-15.2")}
      />

    </div>
  );
};

export default MachineList;

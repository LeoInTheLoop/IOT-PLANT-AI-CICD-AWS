import { useEffect, useState } from "react";
import Filters from "./Filters";
import MachineCard from "./MachineCard";

interface Machine {
  id: number;
  machine_id: string;
  type: string;
  airtemp: number;
  processtemp: number;
  rotationalspeed: number;
  torque: number;
  toolwearinmins: number;
  predictionResult?: string;
}

const MachineList = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [counts, setCounts] = useState<number[]>([0, 0, 0]);
  const [isPredictingAll, setIsPredictingAll] = useState(false);

  // Get machine data
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch("/api/machines/latest");
        const data = await response.json();
        console.log("Fetched machines:", data);

        // Update status only when data changes
        setMachines((prevMachines) => {
          if (
            data.length !== prevMachines.length ||
            data.some((newMachine: Machine, index: number) => {
              return (
                JSON.stringify(newMachine) !==
                JSON.stringify(prevMachines[index])
              );
            })
          ) {
            return data;
          }
          return prevMachines;
        });
      } catch (error) {
        console.error("Error fetching machine data:", error);
      }
    };

    fetchMachines();
  }, []);

  // Update classification counts
  useEffect(() => {
    setCounts([
      machines.length,
      machines.filter((m) => m.predictionResult === "normal").length,
      machines.filter((m) => m.predictionResult === "warning").length,
    ]);
  }, [machines]);

  // Implement predicting
  const handlePredict = async (machine: Machine): Promise<string> => {
    // Check if a forecast request is already in progress
    if (machine.predictionResult === "loading") {
      console.log(`Prediction already in progress for machine ${machine.id}`);
      return "Prediction already in progress";
    }

    // Update the status to "loading"
    setMachines((prev) =>
      prev.map((m) =>
        m.id === machine.id ? { ...m, predictionResult: "loading" } : m
      )
    );

    const payload = {
      type: machine.type,
      airtemp: machine.airtemp,
      processtemp: machine.processtemp,
      rotationalspeed: machine.rotationalspeed,
      torque: machine.torque,
      toolwearinmins: machine.toolwearinmins,
    };

    try {
      const response = await fetch(
        "/api/Machines/predict-historical",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const info = await response.json();

      // Update the predictive status
      setMachines((prev) =>
        prev.map((m) =>
          m.id === machine.id
            ? { ...m, predictionResult: info.status.toLowerCase() }
            : m
        )
      );
      console.log("Prediction result:", info.status);
      return info.status || "Prediction complete";
    } catch (error) {
      console.error("Error sending prediction request:", error);

      // Reset state when prediction fails
      setMachines((prev) =>
        prev.map((m) =>
          m.id === machine.id ? { ...m, predictionResult: undefined } : m
        )
      );
      return "Error fetching prediction";
    }
  };

  // Predict all machines
  const handlePredictAll = async () => {
    if (isPredictingAll) return;
    setIsPredictingAll(true);

    try {
      await Promise.all(
        machines.map(async (machine) => {
          if (
            !machine.predictionResult ||
            machine.predictionResult === "error"
          ) {
            await handlePredict(machine);
          }
        })
      );
    } catch (error) {
      console.error("Error predicting all machines:", error);
    } finally {
      setIsPredictingAll(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Filters
            counts={{
              total: counts[0],
              normal: counts[1],
              warning: counts[2],
            }}
          />
          <button
            onClick={handlePredictAll}
            disabled={isPredictingAll}
            className={`px-4 py-2 rounded-md text-white ${
              isPredictingAll
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#173F51] hover:bg-[#0F2A36]"
            }`}
          >
            {isPredictingAll ? "Predicting..." : "Predict All"}
          </button>
        </div>

        <div className="p-4">
          {machines.length > 0 ? (
            machines.map((machine) => (
              <MachineCard
                key={machine.id}
                {...machine}
                onPredict={() => handlePredict(machine)}
              />
            ))
          ) : (
            <p className="text-xl text-center p-4 text-[#173F51]">
              No machines available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MachineList;

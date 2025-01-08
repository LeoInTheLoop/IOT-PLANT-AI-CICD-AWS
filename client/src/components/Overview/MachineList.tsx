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

  // 检测是否在主页
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch("http://localhost:5001/machines/latest");
        const data = await response.json();
        console.log("Fetched machines:", data);

        // 使用函数式更新，避免依赖 machines
        setMachines(prevMachines => {
          if (
            data.length !== prevMachines.length ||
            data.some((newMachine: Machine, index: number) => {
              return JSON.stringify(newMachine) !== JSON.stringify(prevMachines[index]);
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
    const interval = setInterval(() => {
      if (isHomePage()) {
        fetchMachines();
      }
    }, 100000);

    return () => clearInterval(interval);
  }, []);

  // 更新分类计数
  useEffect(() => {
    setCounts([
      machines.length,
      machines.filter((m) => m.predictionResult === "normal").length,
      machines.filter((m) => m.predictionResult === "warning").length,
    ]);
  }, [machines]);

  // 执行预测
  const handlePredict = async (machine: Machine): Promise<string> => {
    // 检查是否已有预测请求正在进行
    if (machine.predictionResult === "loading") {
      console.log(`Prediction already in progress for machine ${machine.id}`);
      return "Prediction already in progress";
    }
  
    // 更新当前机器状态为 "loading"
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
      const response = await fetch("http://localhost:5001/fakepredict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const info = await response.json();
  
      // 更新预测结果
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
  
      // 预测失败时重置状态
      setMachines((prev) =>
        prev.map((m) =>
          m.id === machine.id ? { ...m, predictionResult: undefined } : m
        )
      );
      return "Error fetching prediction";
    }
  };
  
  
  return (
    <div className="flex flex-row w-full items-center justify-center">
      <div className="container mx-auto px-4">
        <Filters
          counts={{
            total: counts[0],
            normal: counts[1],
            warning: counts[2],
          }}
        />
        <div className="p-4">
          {machines.length > 0 ? (
            machines.map((machine) => (
              <MachineCard
                key={machine.id}
                id={machine.id}
                machine_id={machine.machine_id}
                type={machine.type}
                airtemp={machine.airtemp}
                processtemp={machine.processtemp}
                rotationalspeed={machine.rotationalspeed}
                torque={machine.torque}
                toolwearinmins={machine.toolwearinmins}
                predictionResult={machine.predictionResult}
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

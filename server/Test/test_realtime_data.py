# test_realtime_data.py
import requests
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List

class RealtimeDataTester:
    def __init__(self, base_url: str = "http://localhost:5001"):
        self.base_url = base_url
        self.headers = {"Content-Type": "application/json"}
        self.existing_machines = []  # 存储发现的机器ID

    def test_health(self) -> bool:
        """测试服务健康状态"""
        try:
            response = requests.get(f"{self.base_url}/health")
            print(f"\n健康检查状态: {'✅ 正常' if response.status_code == 200 else '❌ 异常'}")
            return response.status_code == 200
        except Exception as e:
            print(f"健康检查失败: {str(e)}")
            return False

    def discover_existing_machines(self) -> List[str]:
        """获取系统中存在的机器ID"""
        try:
            response = requests.get(f"{self.base_url}/machines/latest")
            if response.status_code == 200:
                data = response.json()
                self.existing_machines = [item['machine_id'] for item in data]
                return self.existing_machines
        except Exception:
            pass
        return []

    def test_latest_data(self) -> None:
        """测试获取最新数据接口"""
        try:
            response = requests.get(f"{self.base_url}/machines/latest")
            print("\n获取最新数据:")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ 成功获取 {len(data)} 条最新数据")
                for item in data[:3]:  # 只显示前3条
                    print(f"\n机器ID: {item['machine_id']}")
                    print(f"类型: {item['type']}")
                    print(f"时间戳: {item['timestamp']}")
                    print(f"空气温度: {item['airtemp']}K")
                    print(f"工艺温度: {item['processtemp']}K")
                    print(f"转速: {item['rotationalspeed']}rpm")
            else:
                print(f"❌ 获取失败: {response.text}")
        except Exception as e:
            print(f"❌ 请求出错: {str(e)}")

    def test_data_by_machine_id(self, machine_id: str) -> None:
        """测试获取特定机器的数据"""
        try:
            response = requests.get(f"{self.base_url}/Machines/{machine_id}")
            print(f"\n获取机器 {machine_id} 的数据:")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ 成功获取 {len(data)} 条数据")
                
                # 显示最新的一条数据
                if data:
                    latest = data[0]
                    print("\n最新数据:")
                    print(f"时间戳: {latest['timestamp']}")
                    print(f"空气温度: {latest['airtemp']}K")
                    print(f"工艺温度: {latest['processtemp']}K")
                    print(f"转速: {latest['rotationalspeed']}rpm")
                    print(f"扭矩: {latest['torque']}Nm")
                    print(f"工具磨损: {latest['toolwearinmins']}min")
            else:
                print(f"❌ 获取失败: {response.text}")
        except Exception as e:
            print(f"❌ 请求出错: {str(e)}")

    def test_create_realtime_data(self) -> None:
        """测试创建多条实时数据"""
        test_data_list = [
            {
                "machine_id": "M-7",  # 新机器
                "type": "M",
                "airtemp": 300.8,
                "processtemp": 310.3,
                "rotationalspeed": 1538,
                "torque": 36.1,
                "toolwearinmins": 198,
                "timestamp": datetime.now().isoformat()
            },
            {
                "machine_id": "M-8",  # 另一个新机器
                "type": "H",
                "airtemp": 302.3,
                "processtemp": 310.8,
                "rotationalspeed": 1377,
                "torque": 47.3,
                "toolwearinmins": 22,
                "timestamp": datetime.now().isoformat()
            }
        ]
        
        for data in test_data_list:
            try:
                print(f"\n创建机器 {data['machine_id']} 的实时数据:")
                response = requests.post(f"{self.base_url}/Machine/", json=data)
                if response.status_code == 200:
                    print("✅ 数据创建成功")
                    created_data = response.json()
                    print(f"机器ID: {created_data['machine_id']}")
                    print(f"类型: {created_data['type']}")
                    print(f"记录ID: {created_data['id']}")
                else:
                    print(f"❌ 创建失败: {response.text}")
            except Exception as e:
                print(f"❌ 请求出错: {str(e)}")

def main():
    print("开始测试实时数据接口...")
    tester = RealtimeDataTester()
    
    # 1. 测试服务健康状态
    if not tester.test_health():
        print("服务不可用，测试终止")
        return
        
    # 2. 获取系统中现有的机器ID
    existing_machines = tester.discover_existing_machines()
    print(f"\n发现的现有机器: {', '.join(existing_machines)}")
    
    # 3. 测试获取最新数据
    tester.test_latest_data()
    
    # 4. 测试获取特定机器的数据
    if existing_machines:
        for machine_id in existing_machines[:2]:  # 测试前两个机器
            tester.test_data_by_machine_id(machine_id)
    
    # 5. 测试创建新的实时数据
    tester.test_create_realtime_data()
    
    # 6. 再次获取最新数据验证
    print("\n验证新创建的数据:")
    tester.test_latest_data()

if __name__ == "__main__":
    main()
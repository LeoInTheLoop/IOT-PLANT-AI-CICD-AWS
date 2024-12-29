# test_predict.py
import requests
import json
from typing import Dict, Any

def test_predict_endpoint(data: Dict[str, Any], udi: str, product_id: str, actual_target: int, failure_type: str = "Unknown") -> None:
    """
    测试预测接口并对比实际结果
    
    Args:
        data: 输入数据
        udi: UDI标识
        product_id: 产品ID
        actual_target: 实际标签（0表示正常，1表示故障）
        failure_type: 实际故障类型（如果有）
    """
    base_url = "http://localhost:5001"
    
    print("\n" + "="*50)
    print(f"测试用例 - UDI: {udi}, Product ID: {product_id}")
    print(f"实际状态: {'故障' if actual_target == 1 else '正常'}")
    if actual_target == 1:
        print(f"故障类型: {failure_type}")
    print("="*50)
    
    try:
        response = requests.post(
            f"{base_url}/predict/test",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\n发送的数据:")
        print(json.dumps(data, indent=2))
        
        if response.status_code == 200:
            result = response.json()
            print("\n预测结果:")
            print(json.dumps(result, indent=2))
            
            predicted_failure = result.get("maintenance_needed", False)
            print("\n预测vs实际:")
            print(f"预测状态: {'需要维护' if predicted_failure else '正常运行'}")
            print(f"实际状态: {'故障' if actual_target == 1 else '正常'}")
            print(f"预测概率: {result.get('ensemble_probability', 'N/A')}")
            
            if predicted_failure == bool(actual_target):
                print("\n✅ 预测正确!")
            else:
                print("\n❌ 预测错误!")
                
        else:
            print(f"\n❌ 请求失败 (状态码: {response.status_code})")
            print(f"错误信息: {response.text}")
            
    except Exception as e:
        print(f"\n❌ 发生错误: {str(e)}")

def run_test_cases():
    """运行所有真实数据测试用例"""
    
    # 测试用例1：正常运行 - L53432
    test_case_1 = {
        "type": "L",
        "airtemp": 300.8,
        "processtemp": 310.3,
        "rotationalspeed": 1538.0,
        "torque": 36.1,
        "toolwearinmins": 198.0
    }
    test_predict_endpoint(test_case_1, "6253", "L53432", actual_target=0, failure_type="No Failure")
    
    # 测试用例2：正常运行 - L51922
    test_case_2 = {
        "type": "L",
        "airtemp": 303.3,
        "processtemp": 311.3,
        "rotationalspeed": 1592.0,
        "torque": 33.7,
        "toolwearinmins": 14.0
    }
    test_predict_endpoint(test_case_2, "4743", "L51922", actual_target=0, failure_type="No Failure")
    
    # 测试用例3：正常运行 - L51701
    test_case_3 = {
        "type": "L",
        "airtemp": 302.4,
        "processtemp": 310.4,
        "rotationalspeed": 1865.0,
        "torque": 23.9,
        "toolwearinmins": 129.0
    }
    test_predict_endpoint(test_case_3, "4522", "L51701", actual_target=0, failure_type="No Failure")
    
    # 测试用例4：工具磨损故障 - H35754
    test_case_4 = {
        "type": "H",
        "airtemp": 300.5,
        "processtemp": 309.9,
        "rotationalspeed": 1397.0,
        "torque": 45.9,
        "toolwearinmins": 210.0
    }
    test_predict_endpoint(test_case_4, "6341", "H35754", actual_target=1, failure_type="Tool Wear Failure")
    
    # 测试用例5：散热故障 - L50967
    test_case_5 = {
        "type": "L",
        "airtemp": 302.3,
        "processtemp": 310.8,
        "rotationalspeed": 1377.0,
        "torque": 47.3,
        "toolwearinmins": 22.0
    }
    test_predict_endpoint(test_case_5, "3788", "L50967", actual_target=1, failure_type="Heat Dissipation Failure")

if __name__ == "__main__":
    print("开始测试预测接口，使用完整的真实数据集...\n")
    run_test_cases()
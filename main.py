import requests
import os
from datetime import datetime

# API_Key=nix_live_r5agTX6n860PJLgX5zenHuy75qbvBWs7
# App_ID=app_fbdaf11bcdf3418da3fb5dd9 

APP_ID = os.environ["NT_APP_ID"]
API_KEY = os.environ["NT_API_KEY"]

exercise_endpoint = "https://app.100daysofpython.dev/v1/nutrition/natural/exercise"
sheet_endpoint = os.environ["SHEET_ENDPOINT"]

headers = {
    "x-app-id": APP_ID,
    "x-app-key": API_KEY
}

data = {
    "query": input("What did you do today? "),
    "weight_kg": 45,
    "height_cm": 175,
    "age": 25
}

response = requests.post(url=exercise_endpoint, headers=headers, json=data)
response.raise_for_status()

result = response.json()

today_date = datetime.now().strftime("%d/%m/%Y")
now_time = datetime.now().strftime("%X")

for exercise in result["exercises"]:
    sheet_inputs = {
    "sheet1": {   # <-- MUST match your sheet name
        "date": today_date,
        "time": now_time,
        "exercise": exercise["name"].title(),
        "duration": exercise["duration_min"],
        "calories": exercise["nf_calories"]
    }
}
    

    sheet_response = requests.post(sheet_endpoint, json=sheet_inputs)
    print(sheet_response.text)

print("yay the project works")
import urllib.request
import json

url = "http://127.0.0.1:5001/optimize-schedule"
req = urllib.request.Request(url, method="POST")
req.add_header("Content-Type", "application/json")
data = json.dumps({"num_staff": 12, "num_shifts": 3}).encode("utf-8")

try:
    response = urllib.request.urlopen(req, data=data)
    print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")

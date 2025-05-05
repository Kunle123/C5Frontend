import requests

BASE_URL = "https://api-gw-production.up.railway.app"

# 1. Register a new user
register_payload = {
    "email": "testuser@example.com",
    "password": "TestPassword123"
}
register_response = requests.post(f"{BASE_URL}/register", json=register_payload)
print("Register response:", register_response.status_code, register_response.text)

# 2. Log in to get a token
login_payload = {
    "email": "testuser@example.com",
    "password": "TestPassword123"
}
login_response = requests.post(f"{BASE_URL}/login", json=login_payload)
print("Login response:", login_response.status_code, login_response.text)

if login_response.status_code == 200:
    token = login_response.json().get("access_token") or login_response.json().get("token")
    if not token:
        print("Token not found in login response!")
    else:
        print("Token:", token)

        # 3. Use the token to access a protected endpoint
        headers = {"Authorization": f"Bearer {token}"}
        protected_response = requests.get(f"{BASE_URL}/protected-endpoint", headers=headers)
        print("Protected endpoint response:", protected_response.status_code, protected_response.text)
else:
    print("Login failed, cannot test protected endpoint.")

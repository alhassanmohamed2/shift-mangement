import requests

res = requests.post('http://localhost:8527/auth/login', data={'username': 'admin', 'password': 'admin'})
print(res.status_code, res.text)

import requests
import time
import sys
import webbrowser

CLIENT_ID = '178c6fc778ccc68e1d6a' # GitHub CLI Client ID

print("Requesting device code...")
# 1. Request device and user codes
res = requests.post('https://github.com/login/device/code', data={
    'client_id': CLIENT_ID,
    'scope': 'repo workflow read:org'
}, headers={'Accept': 'application/json'})

data = res.json()
device_code = data['device_code']
user_code = data['user_code']
verification_uri = data['verification_uri']
interval = data['interval']

print(f"\n=======================================================")
print(f"ACTION REQUIRED: Please authorize GitHub CLI")
print(f"=======================================================")
print(f"1. A browser window will open to {verification_uri}")
print(f"2. Paste this 8-digit code: {user_code}")
print(f"=======================================================\n")

# Open browser
webbrowser.open(verification_uri)

# 2. Poll for the access token
print("Waiting for authorization... (this will check automatically)")
while True:
    time.sleep(interval)
    token_res = requests.post('https://github.com/login/oauth/access_token', data={
        'client_id': CLIENT_ID,
        'device_code': device_code,
        'grant_type': 'urn:ietf:params:oauth:grant-type:device_code'
    }, headers={'Accept': 'application/json'})
    
    token_data = token_res.json()
    
    if 'access_token' in token_data:
        print("\n[SUCCESS] Authentication complete!")
        # Write token to file securely
        with open('gh_token.txt', 'w') as f:
            f.write(token_data['access_token'])
        break
    elif token_data.get('error') == 'authorization_pending':
        print(".", end='', flush=True)
    elif token_data.get('error') == 'slow_down':
        interval += 5
    else:
        print(f"\n[ERROR] {token_data.get('error_description', token_data)}")
        break

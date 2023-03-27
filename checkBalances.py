import pandas as pd
from web3 import Web3

# 使用Infura作为提供者，请将 YOUR_API_KEY 替换为你的 Infura API 密钥
url = "https://arbitrum-mainnet.infura.io/v3/e11ebb56ace94b919fd694e2c232765c"
provider = Web3.HTTPProvider(url)
w3 = Web3(provider)

# 请将 PRIVATE_KEYS_FILE.csv 替换为您的CSV文件名
csv_file_path = "PRIVATE_KEYS_FILE.csv"

# 根据您的CSV文件中的列名，将 'private_key' 替换为相应的列名
private_keys = pd.read_csv(csv_file_path)["private_key"].tolist()

def get_balance_and_transaction_count(wallet):
    balance = w3.eth.getBalance(wallet.address)
    transaction_count = w3.eth.getTransactionCount(wallet.address)
    return balance, transaction_count

for private_key in private_keys:
    try:
        wallet = w3.eth.account.privateKeyToAccount(private_key)
    except ValueError as e:
        print(f"Error processing private key: {private_key}")
        print(e)
        continue

    balance, transaction_count = get_balance_and_transaction_count(wallet)
    if transaction_count > 1:
        print(f"Private Key: {private_key}")
        print(f"Address: {wallet.address}")
        print(f"Balance: {w3.fromWei(balance, 'ether')} ETH")
        print(f"Transaction Count: {transaction_count}\n")

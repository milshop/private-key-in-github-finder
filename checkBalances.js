// checkBalances.js

const fs = require("fs");
const csvParser = require("csv-parser");
const { ethers } = require("ethers");

// 使用Infura作为提供者，请将 YOUR_API_KEY 替换为你的 Infura API 密钥
var url = `https://arbitrum-mainnet.infura.io/v3/<your own key>`;
const provider = new ethers.providers.JsonRpcProvider(url);

// 用于读取CSV文件的帮助函数
async function readCSV(filePath) {
  const privateKeyRows = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        privateKeyRows.push(row);
      })
      .on("end", () => {
        resolve(privateKeyRows);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function main() {
  // 请将 PRIVATE_KEYS_FILE.csv 替换为您的CSV文件名
  const csvFilePath = "PRIVATE_KEYS_FILE.csv";
  const privateKeys = await readCSV(csvFilePath);

  for (const row of privateKeys) {
    // 根据您的CSV文件中的列名，将 'private_key' 替换为相应的列名
    const privateKey = row["private_key"];
    const wallet = new ethers.Wallet(privateKey, provider);

    // 获取地址的余额和交易计数
    const balance = await wallet.getBalance();
    const transactionCount = await wallet.getTransactionCount();

    if (transactionCount > 1) {
      console.log(`Private Key: ${privateKey}`);
      console.log(`Address: ${wallet.address}`);
      console.log(`Balance: ${ethers.utils.formatEther(balance)} ETH`);
      console.log(`Transaction Count: ${transactionCount}\n`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

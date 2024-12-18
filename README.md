# Torque
EVM-compatible NFT minting bot 

---

## 📖 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Installation](#-installation)
4. [Error Handling & Fallbacks](#%EF%B8%8F-error-handling--fallbacks)
5. [Future Improvements](#-future-improvements)
6. [Contact](#-contact)
7. [License](#-license)

---

## 📋 Features

- **Dynamic Gas Management**: Ensures transactions are included in the first block using real-time gas prices.
- **Multi-Wallet Support**: Execute minting simultaneously for multiple wallets.
- **Fallback Mechanism**: Fallback to `provider.getFeeData` if the BlockNative API fails.
- **Config Management**: Easily save and load configurations for wallets and minting parameters.
- **Graceful Error Handling**: Handles corrupted/missing configurations and transaction failures.
- **Customizable Timing**: Dynamically calculate delays based on the blockchain network.

---

## 🛠️ Tech Stack

- **TypeScript**
- **ethers.js**
- **BlockNative API**
- **Node.js**

---

## 📦 Installation

1. **Clone the repository**:
   ```
   git clone https://github.com/your-username/nft-minting-bot.git
   cd nft-minting-bot
   ```
2. **Install dependencies**:
   `npm install`
3. **Set up environment variables**:
   Create a `.env` file in the root directory and configure your environment:
   ```
   RPC_API=
   PRIVATE_KEY=
   BLOCKNATIVE_API=
   ```
   - `RPC_API`: Your RPC provider URL (Infura, Alchemy, etc.).
   - `PRIVATE_KEY`: API key for BlockNative.
   - `BLOCKNATIVE_API`: The private key of the default wallet.

---


## 🛡️ Error Handling & Fallbacks

- If the BlockNative API fails, the bot gracefully falls back to the `provider.getFeeData` method to fetch gas prices.
- Missing or corrupted `config.json` files will be handled with default settings or user prompts.

---

## 📈 Future Improvements

- [ ] Contract ABI support

---

## 🤝 Contact

- [Telegram](https://t.me/cunnil_eth)
- Discord: cunnil.eth
- Email: canboh085@gmail.com

---

## 📜 License

This project is licensed under the MIT `[LICENSE](LICENSE)`. See LICENSE for details.

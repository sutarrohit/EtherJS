const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
   /* 

  //Connect local Ganache blockchaim
  const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://127.0.0.1:7545"
  );

  //Provide Private key and connection
    const wallet = new ethers.Wallet(
        "Private key",
        provider
    );
*/

  //Get Private key and addres using envioremnt variables.
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider );
  
  //Get abi file
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  //Get byte code file
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  //To connect blockchain ether have ContractFactory function using abi,byte code, privatekey & blockchain address
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait....");
  const contract = await contractFactory.deploy(); //Stop and wait for conformation
  console.log(`Contract address : ${contract.address} `);
  
  //const deploymentReceipt = await contract.deployTransaction.wait(1);
  //console.log(deploymentReceipt);

  //Intracting with contract using etherJS

   const currentFavoritNumber = await contract.retrieve();
   console.log(`Current Favorite Numberis : ${currentFavoritNumber.toString()}`);

   
   const transactionResponse = await contract.store("7");
   const transactionReceipt = await transactionResponse.wait(1);
   const updatedFavoriteNumber = await contract.retrieve()
   console.log(`Updated Favorite Number is : ${updatedFavoriteNumber.toString()} `)

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

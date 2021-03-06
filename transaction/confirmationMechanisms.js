// Learn about Hedera's confirmation mechanisms -
// https://www.hedera.com/blog/transaction-confirmation-methods-in-hedera

// Allow access to our .env file variables
require("dotenv").config();

// uses Hedera JavaScript SDK
const { Client, CryptoTransferTransaction } = require("@hashgraph/sdk");

async function confirmationMechanisms() {
  // Grab account ID and private key from the .env file
  const operatorPrivateKey = process.env.OPERATOR_KEY;
  const operatorAccount = process.env.OPERATOR_ID;
  // If we weren't able to grab it, we should throw a new error
  if (operatorPrivateKey == null || operatorAccount == null) {
    throw new Error(
      "environment variables OPERATOR_KEY and OPERATOR_ID must be present"
    );
  }

  // Create our connection to the Hedera network
  const client = new Client({
    network: { "0.testnet.hedera.com:50211": "0.0.3" },
    operator: {
      account: operatorAccount,
      privateKey: operatorPrivateKey,
    },
  });

  // Crypto Transfer Transaction
  // Confirmation 1 - Executing will run a "precheck"
  const transactionId = await new CryptoTransferTransaction()
    .addSender(operatorAccount, 0)
    .addRecipient("0.0.1", 0)
    .setTransactionMemo("testing :)")
    .execute(client);

  // Confirmation 2 - Ask for a receipt
  console.log(
    `attempting to get receipt for transaction id = ${transactionId}\n`
  );
  const receipt = await transactionId.getReceipt(client);
  console.log(
    `transaction ${transactionId} receipt = ${JSON.stringify(receipt)}\n`
  );

  // Confirmation 3 - Ask for a record
  // Note: these cost HBAR! View the network fees at docs.hedera.com
  // You should only request these
  // when it's worth paying for the extra details it provides
  console.log(
    `attempting to get record for transaction id = ${transactionId}\n`
  );
  const record = await transactionId.getRecord(client);
  console.log(
    `transaction ${transactionId} record = ${JSON.stringify(record)}\n`
  );
}

confirmationMechanisms();

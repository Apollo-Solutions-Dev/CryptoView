const TransactionsSchema = require("../models/transactionsModel.js");
const Web3 = require('web3');
const axios = require('axios');

const getAddressTransactions = async (req, res) => {
  try {
    const { address } = req.params;
    const { startDate, endDate } = req.query;
    
    // Fetch from Etherscan API
    const response = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 5, // Get last 5 transactions
        sort: 'desc',
        apikey: process.env.ETHERSCAN_API_KEY
      }
    });

    if (response.data.status !== '1') {
      throw new Error(response.data.message);
    }

    // Process and store transactions
    const transactions = response.data.result.map(tx => ({
      address: address,
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: Web3.utils.fromWei(tx.value, 'ether'),
      timestamp: new Date(tx.timeStamp * 1000),
      user_id: req.user._id
    }));

    try {
      // Store in MongoDB
      await TransactionsSchema.insertMany(transactions, { ordered: false });
    } catch (insertError) {
      if (insertError.code === 11000) { // Duplicate key error
        // Instead of returning duplicates, fetch all transactions for this address
        const storedTransactions = await TransactionsSchema.find({ address })
          .sort({ timestamp: -1 })
          .limit(5);
        return res.status(200).json(storedTransactions);
      }
      throw insertError;
    }

    // Query transactions with date filter if provided
    let query = { address };
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const storedTransactions = await TransactionsSchema.find(query)
      .sort({ timestamp: -1 })
      .limit(5);

    res.status(200).json(storedTransactions);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAddressTransactions };

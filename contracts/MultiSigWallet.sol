pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";


contract MultiSigWallet {
	//Establish initial variables
	//numConfirmationsRequired is the number of addresses to use the wallet
	//isOwner establish who owns the wallet
	//Owners is a list of all owners
	//priceFeed gets ETH/USD Pricefeed
	uint public numConfirmationsRequired;
	mapping(address => bool) public isOwner;
	address[] public owners;
	// AggregatorV3Interface internal priceFeed;
	
	//Event for when money is deposited
	event Deposit(address indexed sender, uint amount, uint balance);

	//Event for when a transaction is submitted
	event SubmitTransaction(address indexed owner, uint indexed txIndex, address indexed to, uint value, bytes data);

	//Event for when a transaction is confirmed
	event ConfirmTransaction(address indexed owner, uint indexed txIndex);

	//Event for when a transaction is executed
	event ExecuteTransaction(address indexed owner, uint indexed txIndex);

	//Event for when a transaction confirmation is revoked
	event RevokeConfirmation(address indexed owner, uint indexed txIndex);

	//Event for when a transaction is revoked
	event RevokeTransaction(address indexed owner, uint indexed txIndex);

	//modifier to only allows owners submit transactions
	modifier onlyOwner {
		require(isOwner[msg.sender], "You are not an owner");
		_;
	}

	//modifier to confirm a transaction exits
	modifier txExists(uint _txIndex) {
		require(_txIndex < transactions.length, "Transaction doesn't exist!");
		_;
	}

	//modifier to confirm a transaction's execution status
	modifier notExecuted(uint _txIndex) {
		require(!transactions[_txIndex].executed, "Transaction has been executed");
		_;
	}

	//modifier to determine transaction's confirmation status
	modifier notConfirmed(uint _txIndex) {
		require(!transactions[_txIndex].isConfirmed[msg.sender], "tx already confirmed");
		_;
	}

	//Create Transaction Type
	struct Transaction {
		address to;
		uint value;
		bytes data;
		bool executed;
		uint numConfirmations;
		mapping(address => bool) isConfirmed;
	}

	//An array of transactions
	Transaction[] public transactions;

	//the constructor establishes the initial owners and number of confirmations required for a wallet
	constructor(address[] memory _owners, uint _numConfirmationsRequired) public {
		require(_owners.length > 0, "owners requires");
		require(_numConfirmationsRequired > 0 && _numConfirmationsRequired <= _owners.length, "Confirmation Number Mismatch");
		for (uint i = 0; i < _owners.length; i++) {
			address owner = _owners[i];

			require(owner != address(0), "Owner shouldn't be zero address");
			require(!isOwner[owner], "Owner not unique!");

			isOwner[owner] = true;
			owners.push(owner);
		}

		numConfirmationsRequired = _numConfirmationsRequired;

		//priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
	}


	//Submits a transaction from one of the wallets owners
	function submitTransaction(address _to, uint _value, bytes memory _data) public onlyOwner {
		uint txIndex = transactions.length;

		transactions.push(Transaction({
			to: _to,
		      	value: _value, 
			data: _data,
			executed: false,
			numConfirmations: 0
		}));

		emit SubmitTransaction(msg.sender,txIndex, _to, _value, _data); 

	}



	//Confirm a transaction from one of the wallet owners
	function confirmTransaction(uint _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) {
		Transaction storage transaction = transactions[_txIndex];
		transaction.isConfirmed[msg.sender] = true;
		transaction.numConfirmations++;

		emit ConfirmTransaction(msg.sender, _txIndex);

	}

	//Execute a transaction after confirmation
	function executeTransaction(uint _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
		Transaction storage transaction = transactions[_txIndex];

		require(transaction.numConfirmations >= numConfirmationsRequired, "Not enough confirmations");
		
		transaction.executed = true;

		(bool success, ) = transaction.to.call.value(transaction.value)(transaction.data);
		require (success, "Transaction failed");

		emit ExecuteTransaction(msg.sender, _txIndex);
	}

	//Revoke a confirmation
	function revokeConfirmation(uint _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
		Transaction storage transaction = transactions[_txIndex];
		require(transaction.isConfirmed[msg.sender] = true);
		transaction.isConfirmed[msg.sender] = false;
		transaction.numConfirmations--;

		emit RevokeConfirmation(msg.sender, _txIndex);
	}


	function getBalance() public view returns (uint) {
		return address(this).balance;
	}

	//function getBalanceInUSD() public view returns (uint) {
	//     	 (
       	//		uint80 roundID, 
        // 		int price,
        //    		uint startedAt,
        //    		uint timeStamp,
        //    		uint80 answeredInRound
        //	) = priceFeed.latestRoundData();
	//	return address(this).balance / uint(price);
	//}






	//the fallback emits a Deposit event and allows paying the wallet
	receive() payable external {
		emit Deposit(msg.sender, msg.value, address(this).balance);
	}

	//Get transaction
	function getTransaction(uint _txIndex) public view returns (address to, uint value, bytes memory data, bool executed, uint numConfirmations)
	{
                Transaction storage transaction = transactions[_txIndex];
		return (transaction.to, transaction.value, transaction.data, transaction.executed, transaction.numConfirmations);
	}

	//Get Transaction Count
	function getTransactionCount() public view returns (uint) {
		return transactions.length;
	}

	//Get Owners
	function getOwners() public view returns (address[] memory) {
		return owners;
	}

}


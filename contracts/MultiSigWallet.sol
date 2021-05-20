pragma solidity ^0.6.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiSigWallet {
	//establish initial variables
	//numConfirmationsRequired is the number of addresses to use the wallet
	//isOwner establish who owns the wallet
	//owners is a list of all owners
	uint public numConfirmationsRequired;
	mapping(address => bool) public isOwner;
	address[] public owners;
	
	//Event for when money is deposited
	event deposit(address indexed sender, uint amount, uint balance);

	//Event for when a transaction is submitted
	event submitTransaction(address indexed owner, uint indexed txIndex, address indexed to, uint value, bytes data);

	//Event for when a transaction is confirmed
	event confirmTransaction(address indexed owner, uint indexed txIndex);

	//Event for when a transaction is executed
	event executeTransaction(address indexed owner, uint indexed txIndex);

	//modifier to only allows owners submit transactions
	modifier onlyOwner {
		require(isOwner[msg.sender] "You are not an owner");
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
		for (uint i = 0; i < _owners.length, i++) {
			address owner = _owners[i];

			require(owner != address(0), "Owner shouldn't be zero address");
			require(!isOwner[owner], "Owner not unique!");

			isOwner[owner] = true;
			owners.push(owner);
		}

		numConfirmationsRequired = _numConfirmationsRequired;
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

		emit submitTransaction(msg.sender,txIndex, _to, _value, _data); 

	}

	//Confirm a transaction from one of the wallet owners
	function confirmTransaction(uint _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) {
		Transaction storage transaction = transactions[_txIndex];
		transaction.isConfirmed[msg.sender] = true;
		transaction.numConfirmation++;

		emit confirmTransaction(msg.sender, _txIndex);

	}


	//the fallback emits a Deposit event and allows paying the wallet
	receive() payable external {
		emit deposit(msg.sender, msg.value, address(this).balance);
	}

}


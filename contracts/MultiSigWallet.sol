pragma solidity ^0.6.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiSigWallet {
	uint public numConfirmationsRequired;
	mapping(address => bool) public isOwner;
	address[] public owners;

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


}


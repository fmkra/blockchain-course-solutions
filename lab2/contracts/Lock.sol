// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract NumberStorage {
    uint256 public value;

    event ValueChanged(uint256 newValue);

    constructor() {
        value = 0;
    }

    function multiply() public {
        value = value * 2;
        emit ValueChanged(value);
    }

    function add() public {
        value = value + 3;
        emit ValueChanged(value);
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}

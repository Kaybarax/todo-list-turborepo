// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Test {
  string public message = "Hello World";

  function setMessage(string memory _message) public {
    message = _message;
  }
}

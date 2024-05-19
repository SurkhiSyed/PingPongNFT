// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract PingPongReward {
    address public owner;
    uint256 public rewardAmount;

    event RewardSent(address indexed player, uint256 amount);

    constructor(uint256 _rewardAmount) {
        owner = msg.sender;
        rewardAmount = _rewardAmount;
    }

    function sendReward(address player) public {
        require(msg.sender == owner, "Only owner can send rewards");
        require(player != address(0), "Invalid player address");

        payable(player).transfer(rewardAmount);
        emit RewardSent(player, rewardAmount);
    }

    receive() external payable {}

    function withdraw(uint256 amount) public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(amount <= address(this).balance, "Insufficient balance");

        payable(owner).transfer(amount);
    }
}

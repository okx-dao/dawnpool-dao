// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./DawnBase.sol";

contract DawnPoolTest is Initializable, DawnBase {
    bytes32 public constant _MIN_STAKING_AMOUNT = keccak256("DawnPoolTest.MIN_STAKING_AMOUNT");

    constructor(){
        _disableInitializers();
    }

    function initialize(address dawnStorage) external initializer {
        _dawnStorage = IDawnStorageInterface(dawnStorage);
    }

    function setMinStakingAmount(uint256 minStakingAmount) external onlyDAO {
        _setUint(_MIN_STAKING_AMOUNT, minStakingAmount);
    }

    function getMinStakingAmount() external view returns(uint256) {
        return _getUint(_MIN_STAKING_AMOUNT);
    }
}

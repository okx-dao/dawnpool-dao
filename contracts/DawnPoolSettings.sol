// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import { PluginUUPSUpgradeable, IDAO } from '@aragon/osx/core/plugin/PluginUUPSUpgradeable.sol';
import "./interface/IDawnStorageInterface.sol";

contract DawnPoolSettings is PluginUUPSUpgradeable {
    bytes32 public constant DAWN_POOL_SETTINGS_ROOT_PERMISSION_ID = keccak256('DAWN_POOL_SETTINGS_ROOT_PERMISSION_ID');

    IDawnStorageInterface internal _dawnStorage;

    event DawnPoolParamsSet(bytes32 contractHash, address to, bytes data);

    error NotDawnPoolContract(bytes32 contractHash);
    error ExecutionFailed(bytes32 contractHash, address to, bytes data);

    constructor(){
    }

    function initialize(IDAO dao, address dawnStorage) external initializer {
        __PluginUUPSUpgradeable_init(dao);
        _dawnStorage = IDawnStorageInterface(dawnStorage);
    }

    function setDawnPoolParams(
        bytes32 contractHash,
        bytes calldata data
    )
    external
    auth(DAWN_POOL_SETTINGS_ROOT_PERMISSION_ID)
    returns (bytes memory result) {
        address to = _dawnStorage.getAddress(contractHash);
        if(to == address(0)) {
            revert NotDawnPoolContract(contractHash);
        }
        (bool success, bytes memory res) = to.call(data);
        if(!success) {
            revert ExecutionFailed(contractHash, to, data);
        }
        result = res;
        emit DawnPoolParamsSet(contractHash, to, data);
    }

    function getDawnStorage() external view returns (address) {
        return address(_dawnStorage);
    }
}

// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import {PermissionLib} from '@aragon/osx/core/permission/PermissionLib.sol';
import {PluginSetup, IPluginSetup} from '@aragon/osx/framework/plugin/setup/PluginSetup.sol';
import { DawnPoolSettings } from './DawnPoolSettings.sol';

contract DawnPoolSettingsSetup is PluginSetup {
    address private immutable _dawnPoolSettingsImplementation;

    constructor(){
        _dawnPoolSettingsImplementation = address(new DawnPoolSettings());
    }

    function prepareInstallation(
        address _dao,
        bytes memory _data
    ) external returns (address plugin, PreparedSetupData memory preparedSetupData) {
        address dawnStorage = abi.decode(_data, (address));
        plugin = createERC1967Proxy(
            _dawnPoolSettingsImplementation,
            abi.encodeWithSelector(DawnPoolSettings.initialize.selector, _dao, dawnStorage)
        );

        PermissionLib.MultiTargetPermission[] memory permissions = new PermissionLib.MultiTargetPermission[](1);

        permissions[0] = PermissionLib.MultiTargetPermission({
            operation: PermissionLib.Operation.Grant,
            where: plugin,
            who: _dao,
            condition: PermissionLib.NO_CONDITION,
            permissionId: DawnPoolSettings(_dawnPoolSettingsImplementation).DAWN_POOL_SETTINGS_ROOT_PERMISSION_ID()
        });

        preparedSetupData.permissions = permissions;
    }

    function prepareUninstallation(
        address _dao,
        SetupPayload calldata _payload
    ) external view returns (PermissionLib.MultiTargetPermission[] memory permissions) {
        (_dao);
        address plugin = _payload.plugin;
        address permittedAddress = abi.decode(_payload.data, (address));

        // Prepare permissions
        permissions = new PermissionLib.MultiTargetPermission[](1);

        permissions[0] = PermissionLib.MultiTargetPermission({
        operation: PermissionLib.Operation.Revoke,
        where: plugin,
        who: permittedAddress,
        condition: PermissionLib.NO_CONDITION,
        permissionId: DawnPoolSettings(_dawnPoolSettingsImplementation).DAWN_POOL_SETTINGS_ROOT_PERMISSION_ID()
        });
    }

    /// @inheritdoc IPluginSetup
    function implementation() external view override returns (address) {
        return _dawnPoolSettingsImplementation;
    }
}

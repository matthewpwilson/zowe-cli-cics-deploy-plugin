/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright IBM Corp, 2019
*
*/

"use strict";

import { IHandlerParameters, Logger, ImperativeError, Session } from "@brightside/imperative";
import { ZosmfSession, Upload, SshSession, Shell } from "@brightside/core";
import * as fs from "fs";
import * as path from "path";
import { BundleDeployer } from "./BundleDeployer";

/**
 * Class that performs the complete 'push' of a bundle, including upload to zFS, npm install, undeploy and deploy
 *
 * @export
 * @class BundleDeployer
 */
export class BundlePusher {
    private params: IHandlerParameters;
    private inputDir: string;

    /**
     * @param {IHandlerParameters} params - The Imperative handler parameters
     * @throws ImperativeError
     * @memberof BundleDeployer
     */
    constructor(directory: string, params: IHandlerParameters) {
        this.inputDir = directory;
        this.params = params;
    }

    public async push(): Promise<void> {
        const zosmfSession = ZosmfSession.createBasicZosmfSessionFromArguments(this.params.arguments);

        await Upload.dirToUSSDir(zosmfSession, this.inputDir, this.params.arguments.bundledir, undefined, true, undefined, undefined);

        const sshSession = SshSession.createBasicSshSessionFromArguments(this.params.arguments);

        await Shell.executeSshCwd(sshSession, "npm install", this.params.arguments.bundledir, (data: string) => {
            this.params.response.console.log(data);
        });

        const deployParams = Object.assign({}, ...[this.params]);
        const deployer = new BundleDeployer(deployParams);
        deployer.deployBundle();
    }
}


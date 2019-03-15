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

import { IHandlerParameters, Session } from "@brightside/imperative";
import * as DeployBundleDefinition from "../../../src/cli/deploy/bundle/DeployBundle.definition";
import { BundlePusher } from "../../../src/api/BundleDeploy/BundlePusher";
import { BundleDeployer } from "../../../src/api/BundleDeploy/BundleDeployer";
import { Upload, ZosFilesAttributes, ZosmfSession } from "../../../../zowe-cli/lib";
import { Shell, SshSession } from "@brightside/core";

const DEFAULT_PARAMETERS: IHandlerParameters = {
    arguments: {
        $0: "bright",
        _: ["zowe-cli-cics-deploy-plugin", "deploy", "bundle"],
        jobcard: "//DFHDPLOY JOB DFHDPLOY,CLASS=A,MSGCLASS=X,TIME=NOLIMIT",
        bundledir: "/u/freyja/myapp"
    },
    profiles: {
        get: (type: string) => {
            return {};
        }
    } as any,
    response: {
        data: {
            setMessage: jest.fn((setMsgArgs) => {
                expect("" + setMsgArgs).toMatchSnapshot();
            }),
            setObj: jest.fn((setObjArgs) => {
                expect(setObjArgs).toMatchSnapshot();
            })
        },
        console: {
            log: jest.fn((logs) => {
                expect("" + logs).toMatchSnapshot();
            }),
            error: jest.fn((errors) => {
                expect("" + errors).toMatchSnapshot();
            }),
            errorHeader: jest.fn(() => undefined)
        },
        progress: {
            startBar: jest.fn((parms) => undefined),
            endBar: jest.fn(() => undefined)
        }
    } as any,
    definition: DeployBundleDefinition.DeployBundleDefinition,
    fullDefinition: DeployBundleDefinition.DeployBundleDefinition,
};

describe("BundlePusher", () => {
    it("should upload bundle, perform npm install and deploy", async () => {
        const uploadSpy = jest.spyOn(Upload, "dirToUSSDir").mockReturnValueOnce({});
        const shellSpy = jest.spyOn(Shell, "executeSshCwd").mockImplementation(() => null);
        const bundleDeployerSpy = jest.spyOn(BundleDeployer.prototype, "deployBundle");
        const fakeSession = new Session({
            user: "fake",
            password: "fake",
            hostname: "fake",
            port: 443,
            protocol: "https",
            type: "basic"
        });
        jest.spyOn(ZosmfSession, "createBasicZosmfSessionFromArguments").mockReturnValue(fakeSession);
        const fakeSshSession = new SshSession({
            hostname: "localhost",
            port: 22,
            user: "",
            password: ""
        });
        jest.spyOn(SshSession, "createBasicSshSessionFromArguments").mockReturnValue(fakeSshSession);

        const params = Object.assign({}, ...[DEFAULT_PARAMETERS]);
        const testable = new BundlePusher("localAppDir", params);

        await testable.push();

        expect(uploadSpy).toHaveBeenCalledWith(fakeSession,
                                               "localAppDir",
                                               "/u/freyja/myapp",
                                               undefined,
                                               true,
                                               undefined,
                                               undefined);

        expect(shellSpy).toHaveBeenCalledWith(fakeSshSession,
                                              "npm install",
                                              "/u/freyja/myapp",
                                              expect.anything());

        expect(bundleDeployerSpy).toHaveBeenCalled();
    });

    test.skip("should pass through attributes");

    test.skip("should fail when upload fails");

    test.skip("should fail if shell execution fails");

    test.skip("should fail if deploy fails");
});

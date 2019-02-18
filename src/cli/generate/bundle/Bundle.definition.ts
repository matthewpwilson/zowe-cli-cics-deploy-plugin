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

import { ICommandDefinition } from "@brightside/imperative";
import { BundleidOption } from "./options/Bundleid.option";
import { BundleversionOption } from "./options/Bundleversion.option";
import { NodejsappOption } from "./options/Nodejsapp.option";
import { StartscriptOption } from "./options/Startscript.option";
import { PortOption } from "./options/Port.option";

/**
 * Imperative command for the Bundle sub-option of Generate.
 *
 */
export const BundleDefinition: ICommandDefinition = {
    name: "bundle",
    aliases: ["b", "bun", "bund"],
    summary: "Generates a bundle",
    description: "Generate CICS bundle within the working directory. " +
                 "The associated data is constructed from a combination of the " +
                 "command-line options and the contents of package.json. If package.json exists, " +
                 "no options are required, but if it does not exist both --startscript and --nodejsapp are required.",
    type: "command",
    handler: __dirname + "/Bundle.handler",
    options: [ BundleidOption, BundleversionOption, NodejsappOption, StartscriptOption, PortOption ],
    examples: [
        {
            description: "Generate a CICS bundle in the working directory, taking information from package.json",
            options: ``
        },
        {
            description: "Generate a CICS bundle in the working directory, based on package.json but using a bundle ID of \"mybundle\"",
            options: `--bundleid mybundle`
        },
        {
            description: "Generate a CICS bundle in the working directory, where the is no package.json",
            options: `--bundleid mybundle --nodejsapp myapp --startscript server.js`
        }
    ]
};

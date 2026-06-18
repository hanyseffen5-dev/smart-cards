const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [
  projectRoot,
  path.resolve(workspaceRoot, "lib/api-client-react"),
  path.resolve(workspaceRoot, "lib/api-spec"),
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

config.resolver.blockList = [
  new RegExp(
    path.resolve(workspaceRoot, "node_modules/.pnpm").replace(/\\/g, "/") +
      "/(?!.*node_modules/(@workspace|expo|react-native|@react-native|@expo|@babel|metro))",
  ),
];

module.exports = config;

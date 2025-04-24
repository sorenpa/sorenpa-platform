import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const LAYER_CONFIG = {
  di: {
    dependencies: ["presentation", "application", "domain", "infrastructure"],
  },
  presentation: {
    dependencies: ["application", "domain", "di"],
  },
  infrastructure: {
    dependencies: ["application", "domain", "di"],
  },
  application: {
    dependencies: ["domain"],
  },
  domain: {
    dependencies: [],
  },
};

function detectLayer(filePathOrImport, layerConfig) {
  const normalizedPath = filePathOrImport.replace(/\\/g, "/");

  for (const layer of Object.keys(layerConfig)) {
    if (
      normalizedPath.includes(`/${layer}/`) ||
      normalizedPath.endsWith(`/${layer}`)
    ) {
      return layer;
    }
  }

  return null;
}

function isImportAllowed(fromLayer, toLayer, layerConfig) {
  if (!fromLayer || !toLayer) return true; // unknown layers are ignored
  if (fromLayer === toLayer) return true; // Self reference is OK

  const allowedDependencies = layerConfig[fromLayer]?.dependencies || [];
  return allowedDependencies.includes(toLayer);
}

function isRootScopedImport(importPath) {
  return /^@sorenpa\/[^/]+\/?$/.test(importPath); // disallow root scope imports from @sorepa/ scoped packages
}

const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "enforce clean architecture layer boundaries",
    },
    schema: [
      {
        type: "object",
        properties: {
          layers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                dependencies: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["name", "dependencies"],
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const userConfig = context.options[0] || {};
    const layerConfig = {};

    // Use custom or default layer config
    (userConfig.layers || Object.entries(LAYER_CONFIG)).forEach((entry) => {
      const layer = entry.name || entry[0];
      const dependencies = entry.dependencies || entry[1]?.dependencies;
      layerConfig[layer] = { dependencies };
    });

    return {
      ImportDeclaration(node) {
        const fromFile = context.getFilename();
        const importPath = node.source.value;
        const fromLayer = detectLayer(fromFile, layerConfig);

        if (isRootScopedImport(importPath)) {
          context.report({
            node,
            message: `Root import "${importPath}" is disallowed. Specify a layer.`,
          });
          return;
        }

        let resolvedImportPath = importPath;
        if (importPath.startsWith(".")) {
          resolvedImportPath = path.resolve(path.dirname(fromFile), importPath);
        } else if (importPath.startsWith("@/")) {
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          const projectRoot = path.resolve(__dirname, "../../");
          resolvedImportPath = path.resolve(
            projectRoot,
            importPath.replace(/^@\/?/, "")
          );
        }

        const toLayer = detectLayer(resolvedImportPath, layerConfig);

        if (!isImportAllowed(fromLayer, toLayer, layerConfig)) {
          context.report({
            node,
            message: `${"Import violation:"} ${chalk.green(
              fromLayer
            )} → ${chalk.red(toLayer ?? "unknown")} : ${chalk.cyan(
              'import "' + node.source.value + '"'
            )}`,
          });
        }
      },
    };
  },
};

export default rule;

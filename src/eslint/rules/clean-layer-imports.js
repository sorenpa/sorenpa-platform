import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

// ESLint rule configuration structure
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

function detectLayer(filePath) {
  const normalizedPath = filePath.replace(/\\/g, "/");
  for (const [layer] of Object.entries(LAYER_CONFIG)) {
    if (normalizedPath.includes(`/${layer}/`)) {
      return layer;
    }
  }
  return null;
}

function isImportAllowed(fromLayer, toLayer) {
  if (!fromLayer || !toLayer) return true; // unknown layers are ignored
  if (fromLayer === toLayer) return true; // Slef reference is OK

  const allowedDependencies = LAYER_CONFIG[fromLayer]?.dependencies || [];
  return allowedDependencies.includes(toLayer);
}

export default {
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
    // Get custom configuration from ESLint rules
    const userConfig = context.options[0] || {};
    const layerConfig = userConfig.layers || LAYER_CONFIG;

    return {
      ImportDeclaration(node) {
        const fromFile = context.getFilename();
        const importPath = node.source.value;

        const fromLayer = detectLayer(fromFile);

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

        const toLayer = detectLayer(resolvedImportPath);

        console.log({
          fromFile,
          importPath: resolvedImportPath,
          fromLayer,
          toLayer,
        });

        if (!isImportAllowed(fromLayer, toLayer, layerConfig)) {
          context.report({
            node,
            message: `${"Import violation:"} ${chalk.green(
              fromLayer
            )} → ${chalk.red(toLayer)} : ${chalk.cyan(
              'import "' + node.source.value + '"'
            )}`,
          });
        }
      },
    };
  },
};

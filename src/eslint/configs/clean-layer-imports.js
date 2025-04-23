import cleanLayerImports from "../rules/clean-layer-imports.js";

export default [
  {
    files: ["src/**/*.{js,ts,jsx,tsx}"],
    plugins: {
      "clean-arch": {
        rules: {
          "layer-imports": cleanLayerImports,
        },
      },
    },
    rules: {
      "clean-arch/layer-imports": "error",
    },
  },
];

import cleanLayerImports from "../rules/clean-layer-imports";
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
            "clean-layer-imports": "error",
        },
    },
];

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure only ViewModel files import matching View components",
    },
    messages: {
      invalidViewImport:
        "Only a '*VM.tsx' file may import a matching '*View.tsx'",
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importer = context.getFilename();
        const imported = node.source.value;

        if (!imported.includes("View")) return;
        if (!importer.includes("VM.tsx") || !imported.includes("View.tsx")) {
          context.report({
            node,
            messageId: "invalidViewImport",
          });
        }
      },
    };
  },
};

function convertToGeminiSchema(schema) {
  const geminiSchema = { fields: [] };

  for (const field of schema.fields) {
    const geminiField = { name: field.name };

    switch (field.type) {
      case "STRING":
        geminiField.type = "STRING";
        break;
      case "BOOLEAN":
        geminiField.type = "BOOLEAN";
        break;
      default:
        geminiField.type = "UNDEFINED";
    }

    geminiField.mode = field.mode;

    if (field.mode === "REPEATED") {
      geminiField.type = `ARRAY<${geminiField.type}>`;
    }

    if (field.type === "RECORD") {
      for (const subField of field.fields) {
        const subGeminiField = {
          name: `${field.name}.${subField.name}`,
          type: subField.type,
          mode: subField.mode,
        };

        if (subField.mode === "REPEATED") {
          subGeminiField.type = `ARRAY<${subGeminiField.type}>`;
        }

        geminiSchema.fields.push(subGeminiField);
      }
    } else {
      geminiSchema.fields.push(geminiField);
    }
  }

  return geminiSchema;
}

module.exports = {
  convertToGeminiSchema,
};

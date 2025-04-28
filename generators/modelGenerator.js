const fs = require("fs-extra");
const path = require("path");

const generateFakeMethod = (name, attributes) => {
  const fakeValues = attributes.map((attr) => {
    switch (attr.attributeType) {
      case "number":
        return `${attr.attributeName}: Math.floor(Math.random() * 100)`;
      case "string":
        return `${attr.attributeName}: "${attr.attributeName}Sample"`;
      case "boolean":
        return `${attr.attributeName}: Math.random() > 0.5`;
      case "string[]":
        return `${attr.attributeName}: ["Sample1", "Sample2"]`;
      case "number[]":
        return `${attr.attributeName}: [1, 2, 3]`;
      default:
        return `${attr.attributeName}: null`;
    }
  });

  return `
  static fake() {
    return [
      new ${name}({
        ${fakeValues.join(",\n        ")}
      }),
      new ${name}({
        ${fakeValues.join(",\n        ")}
      }),
    ];
  }

  static fakeOne() {
    return new ${name}({
      ${fakeValues.join(",\n      ")}
    });
  }
`;
};

const generateModel = async (name, projectType, isApp, appName, attributes) => {
  let modelDir;

  if (projectType === "nx") {
    modelDir = isApp
      ? path.join("apps", appName, "src/data/models")
      : path.join("libs", appName, "src/models");
  } else if (projectType === "normal") {
    modelDir = path.join("src/data/models");
  } else {
    modelDir = path.join("");
  }

  const classAttributes = attributes.map(
    (attr) => `${attr.attributeName}: ${attr.attributeType};`
  );

  const constructorAssignments = attributes.map(
    (attr) => `this.${attr.attributeName} = data.${attr.attributeName};`
  );

  const modelContent = `
class ${name} {
  ${classAttributes.join("\n  ")}

  constructor(data: any) {
    ${constructorAssignments.join("\n    ")}
  }

  ${generateFakeMethod(name, attributes)}
}

export default ${name};
`;

  // Ensure the directory exists and create the model file
  await fs.ensureDir(modelDir);
  await fs.writeFile(path.join(modelDir, `${name.toLowerCase()}.model.ts`), modelContent);

  console.log(`Model ${name} created successfully in ${modelDir}!`);
};

module.exports = generateModel;

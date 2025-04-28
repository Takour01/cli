const fs = require("fs-extra");
const path = require("path");

const generateCRUDMethods = (name, usesUtil) => {
  if (usesUtil) {
    return `
  // Fetch all
  static async fetchAll(search: string, page: number, rejectWithValue: any) {
    const response = await get${name}s(search, page);
    if (response.status === 200) {
      return ${name}.transformResponse(response, "${name.toLowerCase()}");
    }
    return rejectWithValue({ message: response.statusText, status: response.status });
  }

  // Fetch one
  static async fetchOne(id: number, rejectWithValue: any) {
    const response = await get${name}(id);
    if (response.status === 200) {
      return ${name}.transformSingleResponse(response.data);
    }
    return rejectWithValue({ message: response.statusText, status: response.status });
  }

  // Add
  static async addNew(data: any, token: string, rejectWithValue: any) {
    const response = await create${name}(data, token);
    if (response.status === 201) {
      return ${name}.transformSingleResponse(response.data);
    }
    return rejectWithValue({ message: response.statusText, status: response.status });
  }

  // Edit
  static async edit(id: number, data: any, token: string, rejectWithValue: any) {
    const response = await update${name}(data, id, token);
    if (response.status === 200) {
      return ${name}.transformSingleResponse(response.data);
    }
    return rejectWithValue({ message: response.statusText, status: response.status });
  }

  // Delete
  static async deleteOne(id: number, token: string, rejectWithValue: any) {
    const response = await delete${name}(id, token);
    if (response.status === 200) {
      return id;
    }
    return rejectWithValue({ message: response.statusText, status: response.status });
  }
    `;
  } else {
    return `
  // Fetch all
  static async fetchAll(search: string, page: number, rejectWithValue: any) {
    try {
      const response = await axios.get(\`/api/${name.toLowerCase()}?search=\${search}&page=\${page}\`);
      return ${name}.transformResponse(response, "${name.toLowerCase()}");
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }

  // Fetch one
  static async fetchOne(id: number, rejectWithValue: any) {
    try {
      const response = await axios.get(\`/api/${name.toLowerCase()}/\${id}\`);
      return ${name}.transformSingleResponse(response.data);
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }

  // Add
  static async addNew(data: any, token: string, rejectWithValue: any) {
    try {
      const response = await axios.post(\`/api/${name.toLowerCase()}\`, data, {
        headers: { Authorization: \`Bearer \${token}\` },
      });
      return ${name}.transformSingleResponse(response.data);
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }

  // Edit
  static async edit(id: number, data: any, token: string, rejectWithValue: any) {
    try {
      const response = await axios.put(\`/api/${name.toLowerCase()}/\${id}\`, data, {
        headers: { Authorization: \`Bearer \${token}\` },
      });
      return ${name}.transformSingleResponse(response.data);
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }

  // Delete
  static async deleteOne(id: number, token: string, rejectWithValue: any) {
    try {
      const response = await axios.delete(\`/api/${name.toLowerCase()}/\${id}\`, {
        headers: { Authorization: \`Bearer \${token}\` },
      });
      return id;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
    `;
  }
};

const generateAdditionalMethod = (name, methodName, httpMethod, usesUtil) => {
  if (usesUtil) {
    return `
  static async ${methodName}(data: any, token: string, rejectWithValue: any) {
    const response = await ${methodName}Util(data, token);
    if (response.status === 200) {
      return ${name}.transformSingleResponse(response.data);
    }
    return rejectWithValue({ message: response.statusText, status: response.status });
  }
    `;
  } else {
    return `
  static async ${methodName}(data: any, token: string, rejectWithValue: any) {
    try {
      const response = await axios.${httpMethod}(\`/api/${name.toLowerCase()}/\${data.id}\`, data, {
        headers: { Authorization: \`Bearer \${token}\` },
      });
      return ${name}.transformSingleResponse(response.data);
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
    `;
  }
};

const generateRepository = async (
  name,
  projectType,
  isApp,
  appName,
  usesUtil,
  wantsCRUD,
  additionalMethods
) => {
  let repositoryDir;

  if (projectType === "nx") {
    repositoryDir = isApp
      ? path.join("apps", appName, "src/data/repositories")
      : path.join("libs", appName, "src/repositories");
  } else if (projectType === "normal") {
    repositoryDir = path.join("src/data/repositories");
  } else {
    repositoryDir = path.join("data/repositories");
  }

  // Base class content
  let repositoryContent = `
import axios from "axios";
${
  usesUtil
    ? `import { get${name}, get${name}s,create${name}, update${name}, delete${name} } from "../../utils/${name.toLowerCase()}Utils";`
    : ""
}
import { ${name}Interface, ${name}ResponseInterface } from "../../interfaces/${name.toLowerCase()}.interface";

class ${name} {
  ${wantsCRUD ? generateCRUDMethods(name, usesUtil) : ""}
`;

  // Add additional methods
  additionalMethods.forEach((method) => {
    repositoryContent += generateAdditionalMethod(
      name,
      method.methodName,
      method.httpMethod,
      usesUtil
    );
  });

  // End class
  repositoryContent += `
  static transformResponse(
    response: any,
    message: string
  ): ${name}ResponseInterface {
    return {
      status: response.status,
      data: response.data.data ? response.data.data : response.data || [],
      message: response.statusText || message,
      meta: response.data.meta || [],
      links: response.data.links || [],
    };
  }

  static transformSingleResponse(data: { data: ${name}Interface }): ${name}Interface {
    return data.data;
  }
}

export default ${name};
`;

  // Ensure the directory exists and create the repository file
  await fs.ensureDir(repositoryDir);
  await fs.writeFile(
    path.join(repositoryDir, `${name.toLowerCase()}.repository.ts`),
    repositoryContent
  );

  console.log(`Repository ${name} created successfully in ${repositoryDir}!`);
};

module.exports = generateRepository;

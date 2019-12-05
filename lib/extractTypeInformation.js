/* eslint-disable */
const path = require('path');
const fs = require('fs-extra');
const ts = require('typescript');
const glob = require('fast-glob');

module.exports = async function({ components }) {
  const basePath = process.cwd();
  const tsconfigPath = path.join(basePath, 'tsconfig.json');
  const componentsFile = path.join(basePath, components);

  const { config, error } = ts.readConfigFile(tsconfigPath, filename =>
    fs.readFileSync(filename, 'utf8')
  );

  if (error) {
    console.error(error);
    throw error;
  }

  const { options, errors } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    basePath,
    {},
    tsconfigPath
  );

  if (errors && errors.length) {
    console.error(errors[0]);
    throw errors[0];
  }

  const fullOptions = {
    ...options,
    declaration: true,
    emitDeclarationOnly: true,
    noEmit: false
  };

  // Create a Program with an in-memory emit
  const createdFiles = {};
  const host = ts.createCompilerHost(fullOptions);
  host.writeFile = (name, contents) => {
    const fileName = path.isAbsolute(name)
      ? name
      : path.join(process.cwd(), name);

    createdFiles[fileName] = contents;
  };

  const files = await glob(config.include);

  const program = ts.createProgram(files, fullOptions, host);

  const checker = program.getTypeChecker();

  const componentsSourceFile = program.getSourceFile(componentsFile);

  const moduleSymbol = checker.getSymbolAtLocation(componentsSourceFile);

  const exportSymbols = checker.getExportsOfModule(moduleSymbol);

  const exportedComponents = exportSymbols.map(exportSymbol =>
    exportSymbol.getEscapedName()
  );

  program.emit();

  return {
    componentsFile,
    components: exportedComponents,
    declarations: createdFiles
  };
};

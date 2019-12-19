/* eslint-disable */
const path = require('path');
const fs = require('fs-extra');
const ts = require('typescript');
const micromatch = require('micromatch');

// Stolen from here
// https://stackoverflow.com/questions/1916218/find-the-longest-common-starting-substring-in-a-set-of-strings
function sharedStart(array) {
  var A = array.concat().sort(),
    a1 = A[0],
    a2 = A[A.length - 1],
    L = a1.length,
    i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  return a1.substring(0, i);
}

module.exports = async function({ components }) {
  const basePath = process.cwd();
  const tsconfigPath = path.join(basePath, 'tsconfig.json');
  const componentsFile = path.join(basePath, components);

  const { config } = ts.readConfigFile(tsconfigPath, filename => {
    try {
      fs.readFileSync(filename, 'utf8');
    } catch (e) {
      return '';
    }
  });

  const { options, fileNames } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    basePath,
    {},
    tsconfigPath
  );

  const fullOptions = {
    lib: ['es5'],
    ...options,
    declaration: true,
    emitDeclarationOnly: true,
    noEmit: false
  };

  // Create a Program with an in-memory emit
  const createdFiles = {};

  console.log(fileNames);

  const program = ts.createProgram(fileNames, fullOptions);

  const checker = program.getTypeChecker();

  const componentsSourceFile = program.getSourceFile(componentsFile);

  const moduleSymbol = checker.getSymbolAtLocation(componentsSourceFile);

  const exportSymbols = checker.getExportsOfModule(moduleSymbol);

  const exportedComponents = exportSymbols.map(exportSymbol =>
    exportSymbol.getEscapedName()
  );

  const printer = ts.createPrinter({
    removeComments: true,
    newLine: ts.NewLineKind.LineFeed,
    omitTrailingSemicolon: true,
    noEmitHelpers: true
  });

  // Filter out node types as they are bulky and unlikely to be used
  const declarationExcludes = ['**/node_modules/@types/node/**/*'];

  program
    .getSourceFiles()
    .filter(({ fileName }) => !micromatch.any(fileName, declarationExcludes))
    .forEach(sourceFile => {
      if (!sourceFile.isDeclarationFile) {
        program.emit(sourceFile, (fileName, content) => {
          createdFiles[fileName] = content;
        });
      } else {
        createdFiles[sourceFile.fileName] = printer.printFile(sourceFile);
      }
    });

  const topLevelDirectory = sharedStart(Object.keys(createdFiles));

  const declarations = Object.assign(
    ...Object.entries(createdFiles).map(([fileName, content]) => ({
      [path.relative(topLevelDirectory, fileName)]: content
    }))
  );

  console.log(Object.keys(declarations));

  return {
    componentsFile: path.relative(topLevelDirectory, componentsFile),
    components: exportedComponents,
    declarations
  };
};

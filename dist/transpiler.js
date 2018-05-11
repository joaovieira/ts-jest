'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var fs = require('fs');
var process_1 = require('process');
var ts = require('typescript');
var logger_1 = require('./logger');
function transpileTypescript(filePath, fileSrc, compilerOptions, tsJestConfig) {
  if (tsJestConfig.useExperimentalLanguageServer) {
    logger_1.logOnce('Using experimental language server.');
    return transpileViaLanguageServer(filePath, fileSrc, compilerOptions);
  }
  logger_1.logOnce('Compiling via normal transpileModule call');
  return transpileViaTranspileModile(filePath, fileSrc, compilerOptions);
}
exports.transpileTypescript = transpileTypescript;
function transpileViaLanguageServer(filePath, fileSrc, compilerOptions) {
  var serviceHost = {
    getScriptFileNames: function() {
      return [filePath];
    },
    getScriptVersion: function(fileName) {
      return undefined;
    },
    getCurrentDirectory: function() {
      return process_1.cwd();
    },
    getScriptSnapshot: function(fileName) {
      if (fileName === filePath) {
        return ts.ScriptSnapshot.fromString(fileSrc);
      }
      var result = fs.readFileSync(fileName, 'utf8');
      return ts.ScriptSnapshot.fromString(result);
    },
    getCompilationSettings: function() {
      return compilerOptions;
    },
    getDefaultLibFileName: function() {
      return ts.getDefaultLibFilePath(compilerOptions);
    },
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    getDirectories: ts.sys.getDirectories,
    directoryExists: ts.sys.directoryExists,
  };
  var service = ts.createLanguageService(serviceHost);
  var serviceOutput = service.getEmitOutput(filePath);
  var files = serviceOutput.outputFiles.filter(function(file) {
    return file.name.endsWith('js');
  });
  logger_1.logOnce(
    'JS files parsed',
    files.map(function(f) {
      return f.name;
    })
  );
  var diagnostics = service
    .getCompilerOptionsDiagnostics()
    .concat(service.getSyntacticDiagnostics(filePath))
    .concat(service.getSemanticDiagnostics(filePath));
  if (diagnostics.length > 0) {
    var errors =
      diagnostics.map(function(d) {
        return d.messageText;
      }) + '\n';
    logger_1.logOnce('Diagnostic errors from TSC: ' + errors);
    throw Error(
      'TSC language server encountered errors while transpiling. Errors: ' +
        errors
    );
  }
  return files[0].text;
}
function transpileViaTranspileModile(filePath, fileSource, compilerOptions) {
  return ts.transpileModule(fileSource, {
    compilerOptions: compilerOptions,
    fileName: filePath,
  }).outputText;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90cmFuc3BpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUJBQXlCO0FBQ3pCLG1DQUE4QjtBQUM5QiwrQkFBaUM7QUFDakMsbUNBQW1DO0FBSW5DLDZCQUNFLFFBQWdCLEVBQ2hCLE9BQWUsRUFDZixlQUFtQyxFQUNuQyxZQUEwQjtJQUUxQixJQUFJLFlBQVksQ0FBQyw2QkFBNkIsRUFBRTtRQUM5QyxnQkFBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDL0MsT0FBTywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQ3ZFO0lBQ0QsZ0JBQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sMkJBQTJCLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztBQUN6RSxDQUFDO0FBWkQsa0RBWUM7QUFPRCxvQ0FDRSxRQUFnQixFQUNoQixPQUFlLEVBQ2YsZUFBbUM7SUFFbkMsSUFBTSxXQUFXLEdBQTJCO1FBRTFDLGtCQUFrQixFQUFFO1lBQ2xCLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQixDQUFDO1FBRUQsZ0JBQWdCLEVBQUUsVUFBQSxRQUFRO1lBRXhCLE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFFRCxtQkFBbUIsRUFBRTtZQUNuQixPQUFPLGFBQUcsRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUVELGlCQUFpQixFQUFFLFVBQUEsUUFBUTtZQUN6QixJQUFJLFFBQVEsS0FBSyxRQUFRLEVBQUU7Z0JBRXpCLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDOUM7WUFFRCxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNqRCxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFRCxzQkFBc0IsRUFBRTtZQUN0QixPQUFPLGVBQWUsQ0FBQztRQUN6QixDQUFDO1FBRUQscUJBQXFCLEVBQUU7WUFDckIsT0FBTyxFQUFFLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUNELFVBQVUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVU7UUFDN0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUTtRQUN6QixhQUFhLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhO1FBQ25DLGNBQWMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWM7UUFDckMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsZUFBZTtLQUN4QyxDQUFDO0lBQ0YsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RELElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEQsSUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJO1FBRWpELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDSCxnQkFBTyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUFDLENBQUM7SUFHbkQsSUFBTSxXQUFXLEdBQUcsT0FBTztTQUN4Qiw2QkFBNkIsRUFBRTtTQUMvQixNQUFNLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2pELE1BQU0sQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUVwRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzFCLElBQU0sTUFBTSxHQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsV0FBVyxFQUFiLENBQWEsQ0FBQyxPQUFJLENBQUM7UUFDMUQsZ0JBQU8sQ0FBQyxpQ0FBK0IsTUFBUSxDQUFDLENBQUM7UUFFakQsTUFBTSxLQUFLLENBQ1QsdUVBQXFFLE1BQVEsQ0FDOUUsQ0FBQztLQUNIO0lBRUQsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLENBQUM7QUFLRCxxQ0FDRSxRQUFnQixFQUNoQixVQUFrQixFQUNsQixlQUFtQztJQUVuQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFO1FBQ3BDLGVBQWUsaUJBQUE7UUFDZixRQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDLENBQUMsVUFBVSxDQUFDO0FBQ2hCLENBQUMifQ==

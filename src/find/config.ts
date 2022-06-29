import * as vscode from 'vscode'

/* eslint-disable @typescript-eslint/naming-convention */
const defaultConfigs: Configs = [
  {
    filePath: 'src/**/*.vue',
    specPath: 'test/unit/specs/**/*.spec.js',
  },
  {
    filePath: 'src/**/*.js',
    specPath: 'test/unit/specs/**/*.spec.js',
  },
  {
    filePath: 'app/**/*.rb',
    specPath: 'spec/**/*_spec.rb',
  },
  {
    filePath: '**/*.go',
    specPath: '**/*_test.go',
  },
]

type FindConfig = {
  filePath: string
  specPath: string
};

type Configs = Array<FindConfig>

function getLocalConfigs(): Configs {
  return vscode.workspace.getConfiguration('test-utils').get('localResolves') as Configs
}

function getGlobalConfigs(): Configs {
  return vscode.workspace.getConfiguration('test-utils').get('resolves') as Configs
}

function testExtensions(configs: Configs): Configs {
  return configs.map(config => ({
    filePath: config.specPath,
    specPath: config.filePath,
  }))
}

function findConfig(fileName: string): Configs {
  const userConfigs = getLocalConfigs() || []
  const globalConfigs = getGlobalConfigs() || []

  const configs = [...userConfigs, ...testExtensions(userConfigs), ...globalConfigs, ...testExtensions(globalConfigs)]
  if (!configs) { return [] }

	if (!vscode.workspace.workspaceFolders) { return [] }
  const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath + '/'
  const filePath = fileName.replace(rootPath, '')

  return configs.filter(({filePath: configFilePath}) => {
    const [filePathStart, filePathEnd, ] = configFilePath.split('**/*')
  
    return filePath.startsWith(filePathStart) && filePath.endsWith(filePathEnd)
  })
}

const EXTENSION_REGEX = /^.*?(?<ext>\..*)$/
function filterByExtension(fileName: string, fileExtension: string): boolean {
  return fileName.match(EXTENSION_REGEX)?.groups?.ext === fileExtension
}

export { findConfig, Configs }
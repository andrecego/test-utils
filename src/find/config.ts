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

type ProjectConfig = {
  [key: string]: Configs
}


function getUserLocalConfigs(): Configs | undefined {
  if (!vscode.workspace.workspaceFolders) { return }

  const currentProject = vscode.workspace.workspaceFolders[0].uri.fsPath.split('/').pop()
  if (!currentProject) { return }

  const config = vscode.workspace.getConfiguration('test-utils').get('local') as ProjectConfig

  return config[currentProject]
}

function testExtensions(configs: Configs): Configs {
  return configs.map(config => ({
    filePath: config.specPath,
    specPath: config.filePath,
  }))
}



function findConfig(fileName: string): Configs {
  const userConfigs = getUserLocalConfigs() || []

  const configs = [...userConfigs, ...testExtensions(userConfigs)]
  if (!configs) { return [] }

	if (!vscode.workspace.workspaceFolders) { return [] }
  const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath + '/'
  const filePath = fileName.replace(rootPath, '')

  return configs.filter(({filePath: configFilePath}) => {
    const [filePathStart, filePathEnd, ] = configFilePath.split('/**/*')
  
    return filePath.startsWith(filePathStart) && filePath.endsWith(filePathEnd)
  })
}

const EXTENSION_REGEX = /^.*?(?<ext>\..*)$/
function filterByExtension(fileName: string, fileExtension: string): boolean {
  return fileName.match(EXTENSION_REGEX)?.groups?.ext === fileExtension
}

export { findConfig, Configs }
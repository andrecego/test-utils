import * as vscode from 'vscode'

/* eslint-disable @typescript-eslint/naming-convention */
const defaultConfigs: Configs = [
  {
    fileExtension: '.vue',
    specExtension: '.spec.js',
    replaceFrom: 'src',
    replaceTo: 'test/unit/specs'
  },
  {
    fileExtension: '.js',
    specExtension: '.spec.js',
    replaceFrom: 'src',
    replaceTo: 'test/unit/specs'
  },
  {
    fileExtension: '.rb',
    specExtension: '_spec.rb',
    replaceFrom: 'app',
    replaceTo: 'spec'
  },
  {
    fileExtension: '.go',
    specExtension: '_test.go',
    replaceFrom: '',
    replaceTo: ''
  },
]

type FindConfig = {
  fileExtension: string
  specExtension: string
  replaceFrom: string
  replaceTo: string
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
    fileExtension: config.specExtension,
    specExtension: config.fileExtension,
    replaceFrom: config.replaceTo,
    replaceTo: config.replaceFrom
  }))
}



function findConfig(fileName: string): Configs {
  const userConfigs = getUserLocalConfigs() || []

  const configs = [...userConfigs, ...testExtensions(userConfigs)]
  
  if (!configs) { return [] }

  // ordenar configs em ordem alfabetica de traz para frente

  // return configs.filter(config => filterByExtension(fileName, config.fileExtension)) 
  return configs.filter(({fileExtension, specExtension}) => fileName.endsWith(fileExtension) || fileName.endsWith(specExtension))
}

const EXTENSION_REGEX = /^.*?(?<ext>\..*)$/
function filterByExtension(fileName: string, fileExtension: string): boolean {
  return fileName.match(EXTENSION_REGEX)?.groups?.ext === fileExtension
}

export { findConfig, Configs }
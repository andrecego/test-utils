// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as fs from 'fs'
import { findConfig, Configs } from './find/config'
import { guessUri } from './find/guess-uri'

function guessUris(configs: Configs): vscode.Uri[] {
  if (!vscode.workspace.workspaceFolders) { return [] }
  if (!vscode.window.activeTextEditor) { return [] }

  const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath
  const filePath = vscode.window.activeTextEditor.document.fileName

  return configs.map(config => guessUri(rootPath, filePath, config.filePath, config.specPath))
}

function findFile(guessedUris: vscode.Uri[]): vscode.Uri | undefined {
  const filePath = vscode.window.activeTextEditor?.document.fileName

  return guessedUris.find(uri => fs.existsSync(uri.fsPath) && uri.fsPath !== filePath)
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('test-utils.findMatch', async function () {
    if (!vscode.window.activeTextEditor) { return }

    const configs = findConfig(vscode.window.activeTextEditor.document.fileName)
    if (!configs || !configs.length) { return vscode.window.showErrorMessage('No config found for this file') }

    const guessedUris = guessUris(configs)
    if (!guessedUris.length) { return vscode.window.showErrorMessage('No matching file found') }

    const filePath = findFile(guessedUris)
    if (!filePath) {
      const fileChoice = await vscode.window.showQuickPick(guessedUris.map(uri => uri.fsPath))
      const uriToCreate = guessedUris.find(uri => uri.fsPath === fileChoice)
      if (!uriToCreate) { return }

      await vscode.workspace.fs.writeFile(uriToCreate, Buffer.from(''))
      await vscode.window.showTextDocument(uriToCreate)

      return
    }

    const input: any = vscode.window.tabGroups?.activeTabGroup?.activeTab?.input
    if (input?.['original']?.['scheme'] !== 'review') { 
      await vscode.window.showTextDocument(filePath)
      return
    }

    // check if filePath is already open in any tab
    const tabs: vscode.Tab[] = vscode.window.tabGroups.all.map(tg => tg.tabs).flat()
    const alreadyOpenTab = tabs.find(tab => 
      (tab.input instanceof vscode.TabInputText) && 
        tab.input.uri.toString() === filePath.toString()
    )

    // IMPROVEMENT: open the diff view without opening the file in a new tab (pr.openDiffView using a GitFileChangeNode)
    // open the file in a new tab and then open the diff view
    await vscode.window.showTextDocument(filePath)
    await vscode.commands.executeCommand('pr.openDiffViewFromEditor', filePath)


    // close the tab if it was not already open
    if (!alreadyOpenTab) {
      const tabs: vscode.Tab[] = vscode.window.tabGroups.all.map(tg => tg.tabs).flat()
      const index = tabs.findIndex(tab => tab.input instanceof vscode.TabInputText && tab.input.uri.path === filePath.path)
      if (index !== -1) {
        await vscode.window.tabGroups.close(tabs[index])
      }
    }
  })

  context.subscriptions.push(disposable)
}

export function deactivate() { }

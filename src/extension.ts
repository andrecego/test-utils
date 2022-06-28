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

	return configs.map(config => guessUri(rootPath, filePath, config.fileExtension, config.specExtension, config.replaceFrom, config.replaceTo))

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
			const userChoice = await vscode.window.showErrorMessage('Could not find file', 'Create File')
			if (userChoice === 'Create File') {
				const uriToCreate = guessedUris[0]
				await vscode.workspace.fs.writeFile(uriToCreate, new Buffer(''))
				vscode.window.showTextDocument(uriToCreate)
			}

			return
		}

		await vscode.window.showTextDocument(filePath)
	})

	context.subscriptions.push(disposable)
}

export function deactivate() { }

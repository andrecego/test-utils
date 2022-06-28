// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as fs from 'fs'
import { findConfig, Configs } from './find/config'
import { guessUri } from './find/guess-uri'

function findFile2(configs: Configs): vscode.Uri | undefined {
	if (!vscode.workspace.workspaceFolders) { return }
	if (!vscode.window.activeTextEditor) { return }

	const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath
	const filePath = vscode.window.activeTextEditor.document.fileName

	const guessedUris =  configs
		.map(config => guessUri(rootPath, filePath, config.fileExtension, config.specExtension, config.replaceFrom, config.replaceTo))

	return guessedUris.find(uri => fs.existsSync(uri.fsPath) && uri.fsPath !== filePath)
}

function findFile(currentExtension: string, guessedExtensions: string[], replaceFrom: string, replaceTo: string): vscode.Uri | undefined {
	if (!vscode.workspace.workspaceFolders) { return }
	if (!vscode.window.activeTextEditor) { return }

	const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath
	const filePath = vscode.window.activeTextEditor.document.fileName

	return guessedExtensions
		.map((guessedExtension: string) => guessUri(rootPath, filePath, currentExtension, guessedExtension, replaceFrom, replaceTo))
		.find(uri => fs.existsSync(uri.fsPath))
}


// 	guessedUris.push(uri);
// 	try {
// 		console.log('foundUri before search', foundUri);
// 		foundUri = await vscode.window.showTextDocument(uri);
// 	} catch (error) {
// 		console.log('foundUri in error', foundUri);
// 		foundUri = undefined;
// 		console.log(error);
// 	} finally {
// 		console.log('foundUri in finally', foundUri);
// 		if (foundUri) { return foundUri; }
// 	}

// const guessPromises = guessedExtensions.map(guessedExtension => {
// 	const uri = guessUri(rootPath, filePath, currentExtension, guessedExtension, replaceFrom, replaceTo);
// 	return vscode.window.showTextDocument(uri);
// });




// 	vscode.window.showErrorMessage('Could not find file, searched for files: ' + guessedUris.map(uri => uri.fsPath).join(",\n "));
// 	return undefined;
// }

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('test-utils.findMatch', async function () {
		if (!vscode.window.activeTextEditor) { return }

		const configs = findConfig(vscode.window.activeTextEditor.document.fileName)
		if (!configs || !configs.length) { return vscode.window.showErrorMessage('No config found for this file') }

		const filePath = findFile2(configs)
		if (!filePath) { return vscode.window.showErrorMessage('Could not find file') }

		await vscode.window.showTextDocument(filePath)
	})

	context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() { }

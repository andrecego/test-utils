import * as vscode from 'vscode'
import { replaceEnding } from '../helpers/string-utils'

export function guessUri(rootPath: string, filePath: string, fileExtension:string , specExtension:string , replaceFrom:string , replaceTo: string): vscode.Uri {
	const currentFileRelativePath = filePath.replace(rootPath, '')

	const currentFilePath = replaceEnding(currentFileRelativePath, fileExtension, specExtension).replace(replaceFrom, replaceTo)

	return vscode.Uri.file(rootPath + currentFilePath)
}
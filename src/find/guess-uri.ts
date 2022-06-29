import * as vscode from 'vscode'
import { replaceEnding } from '../helpers/string-utils'

export function guessUri(rootPath: string, filePath: string, configFilePath:string , configSpecPath:string): vscode.Uri {
	const currentFileRelativePath = filePath.replace(rootPath, '')

	const [filePathStart, filePathEnd, ] = configFilePath.split('**/*')
	const [specPathStart, specPathEnd, ] = configSpecPath.split('**/*')

	let currentFilePath = currentFileRelativePath.replace(filePathStart, specPathStart)
	currentFilePath = replaceEnding(currentFilePath, filePathEnd, specPathEnd)

	return vscode.Uri.file(rootPath + currentFilePath)
}
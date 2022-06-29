import * as vscode from 'vscode'
import { replaceEnding } from '../helpers/string-utils'

export function guessUri(rootPath: string, filePath: string, configFilePath:string , configSpecPath:string): vscode.Uri {
	const currentFileRelativePath = filePath.replace(rootPath, '')

	const [filePathStart, filePathEnd, ] = configFilePath.split('/**/*')
	const [specPathStart, specPathEnd, ] = configSpecPath.split('/**/*')

	const currentFilePath = replaceEnding(currentFileRelativePath, filePathEnd, specPathEnd).replace(filePathStart, specPathStart)

	return vscode.Uri.file(rootPath + currentFilePath)
}
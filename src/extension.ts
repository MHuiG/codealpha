import * as vscode from 'vscode';

export function deactivate() { }

export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('codealpha.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World1 from CodeAlpha!');
  });

  context.subscriptions.push(disposable);
}


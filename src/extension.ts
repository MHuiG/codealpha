import * as vscode from 'vscode';
import fetch from "node-fetch";
export function deactivate() { }

const SEARCH_PHARSE_END = ['.', ',', '{', '(', ' ', '-', '_', '+', '-', '*', '=', '/', '?', '<', '>']

export function activate(context: vscode.ExtensionContext) {
  const target = vscode.workspace.workspaceFolders ? vscode.ConfigurationTarget.WorkspaceFolder : vscode.ConfigurationTarget.Global;
  let disposable = vscode.commands.registerCommand('codealpha.settings', () => {
    vscode.window.showInputBox(
      { "prompt": "Please type your API Service Link here.", "password": false }
    ).then(api => vscode.workspace.getConfiguration().update("api", api, target))
  });

  context.subscriptions.push(disposable);

  // https://github.com/microsoft/vscode-extension-samples/blob/main/inline-completions/src/extension.ts

  const provider: vscode.InlineCompletionItemProvider = {
    provideInlineCompletionItems: async (document, position, context, token) => {
      const API = vscode.workspace.getConfiguration().get("api", "")
      const textBeforeCursor = document.getText()
      if (textBeforeCursor.trim() === "") {
        return { items: [] };
      }
      const currLineBeforeCursor = document.getText(
        new vscode.Range(position.with(undefined, 0), position)
      );

      // Check if user's state meets one of the trigger criteria
      if (SEARCH_PHARSE_END.includes(textBeforeCursor[textBeforeCursor.length - 1]) || currLineBeforeCursor.trim() === "") {
        let rs;
        try {
          // Fetch the code completion based on the text in the user's document
          rs = await fetchCodeCompletionTexts(textBeforeCursor, API);
          if (!rs) {
            return { items: [] };
          }
        } catch (err) {
          if (err instanceof Error) {
            vscode.window.showErrorMessage(err.toString());
          }
          return { items: [] };
        }
        // Add the generated code to the inline suggestion list
        const items = new Array<any>();
        for (let i = 0; i < rs.length; i++) {
          items.push({
            insertText: rs[i],
            range: new vscode.Range(position.translate(0, rs.length), position)
          });
        }
        return { items };
      }
      return { items: [] };
    },
  };

  vscode.languages.registerInlineCompletionItemProvider({ pattern: "**" }, provider);
}

function fetchCodeCompletionTexts(prompt: string, API: string): Promise<Array<string>> {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(API, {
        method: "post",
        body: prompt,
        headers: {
          "Content-type": "application/json; charset=utf-8"
        }
      });
      const json = await res.json();
      console.log(json);
      if (Array.isArray(json)) {
        resolve(json);
      } else {
        throw new Error("not json error");
      }
    } catch (err) {
      return reject(err);
    }
  })
}
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const getConvertedText = (text: string): string => {

    //見出しの変換
    text = text.replace(/＃＃＃＃＃＃[　 ]/g, "###### ");
    text = text.replace(/＃＃＃＃＃[　 ]/g, "##### ");
    text = text.replace(/＃＃＃＃[　 ]/g, "#### ");
    text = text.replace(/＃＃＃[　 ]/g, "### ");
    text = text.replace(/＃＃[　 ]/g, "## ");
    text = text.replace(/＃[　 ]/g, "# ");

    //二重引用の変換
    text = text.replace(/＞＞[　 ]/g, ">> ");

    //引用の変換
    text = text.replace(/＞[　 ]/g, "> ");

    //斜体かつ太字の変換
    text = text.replace(/＊＊＊([^＊　 \r\n]+)＊＊＊/g, "***$1***");
    text = text.replace(/＿＿＿([^＿　 \r\n]+)＿＿＿/g, "___$1___");

    //太字の変換
    text = text.replace(/＊＊([^＊　 \r\n]+)＊＊/g, "**$1**");
    text = text.replace(/＿＿([^＿　 \r\n]+)＿＿/g, "__$1__");

    //斜体の変換
    text = text.replace(/＊([^＊　 \r\n]+)＊/g, "*$1*");
    text = text.replace(/＿([^＿　 \r\n]+)＿/g, "_$1_");

    //水平線の変換
    text = text.replace(/＊＊＊[\r\n]/g, "***\n");
    text = text.replace(/＿＿＿[\r\n]/g, "___\n");
    text = text.replace(/ーーー[\r\n]/g, "---\n");
    text = text.replace(/(＊[ 　]+){2}＊[\r\n]/g, "***\n");
    text = text.replace(/(＿[ 　]+){2}＿[\r\n]/g, "___\n");
    text = text.replace(/(ー[ 　]+){2}ー[\r\n]/g, "---\n");

    //番号付きリストの変換
    text = text.replace(/([０-９0-9]+)[。．.][　 ]/g, "1. ");

    //箇条書きリストの変換
    text = text.replace(/[ー-][　 ]/g, "- ");
    text = text.replace(/[＊*][　 ]/g, "* ");
    text = text.replace(/[＋+][　 ]/g, "+ ");

    //リンクの変換
    text = text.replace(/［(.*)］（(.*)）/g, "[$1]($2)");

    //定義参照リンクの変換
    text = text.replace(/［(.*)］［(.*)］/g, "[$1][$2]");
    text = text.replace(/［(.*)］：[　 ](.*)/g, "[$1]: $2");

    return text;
};


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('zenkakumarkdown.convert', () => {

        const editor = vscode.window.activeTextEditor;
        if( editor ) {
            const document = editor.document;
            //もし、アクティブなファイルがマークダウンなら
            if( document.languageId === "markdown" ) {
                //現在のエディターの文字列をmarkdownの正しい記法に変換して変数に格納
                const convertedText: string =  getConvertedText(document.getText());
                //エディターの文字列を変換した文字列に置き換える
                editor.edit(builder => {
                    builder.replace(new vscode.Range(document.lineAt(0).range.start, document.lineAt(document.lineCount - 1).range.end), convertedText);
                });
            }
        } 
        else {
            console.log("ファイルを開いていませんでした。");
        }

	});
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}


import { Editor, MarkdownView, Plugin, Menu } from "obsidian";

export default class MarkdownHeadingsPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "increase-markdown-headings-command",
			name: "Increase Markdown headings depth",
			editorCheckCallback: (checking: boolean, editor: Editor) => {
				if (checking) {
					if (!editor.somethingSelected()) {
						return false;
					}
				}

				changeSelectionMarkdownHeadingsDepth(editor, 1);

				return true;
			},
		});

		this.addCommand({
			id: "decrease-markdown-headings-command",
			name: "Decrease Markdown headings depth",
			editorCheckCallback: (checking: boolean, editor: Editor) => {
				if (checking) {
					if (!editor.somethingSelected()) {
						return false;
					}
				}

				changeSelectionMarkdownHeadingsDepth(editor, -1);

				return true;
			},
		});

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu: Menu, editor: Editor) => {
				menu.addItem((item) => {
					item
						.setTitle("Decrease Markdown headings depth")
						.setIcon("left-arrow-with-tail")
						.onClick(() => {
							changeSelectionMarkdownHeadingsDepth(editor, -1);
						});
				});
			})
		);

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu: Menu, editor: Editor) => {
				menu.addItem((item) => {
					item
						.setTitle("Increase Markdown headings depth")
						.setIcon("right-arrow-with-tail")
						.onClick(() => {
							changeSelectionMarkdownHeadingsDepth(editor, 1);
						});
				});
			})
		);
	}

	onunload() {}
}

function changeSelectionMarkdownHeadingsDepth(editor: Editor, depth: number) {
	const selection = editor.getSelection();
	changeMarkdownHeadingsDepth(selection, depth).then((modified) => {
		editor.replaceSelection(modified);
	});
}

async function changeMarkdownHeadingsDepth(
	source: string,
	depth: number
): Promise<string> {
	return source
		.split("\n")
		.map((line) => {
			const match = line.match(/^(#+) (.*)/);

			if (match) {
				let pounds;
				if (depth > 0) {
					pounds = match[1] + "#".repeat(depth);
				} else {
					pounds = match[1].slice(0, Math.max(match[1].length + depth, 1));
				}

				return `${pounds} ${match[2]}`;
			} else {
				return line;
			}
		})
		.join("\n");
}

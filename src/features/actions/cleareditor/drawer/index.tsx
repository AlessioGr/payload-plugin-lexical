import './index.scss';
import * as React from "react";
import { CLEAR_EDITOR_COMMAND, LexicalEditor } from 'lexical';
import Button from 'payload/dist/admin/components/elements/Button';
import { useEditDepth } from 'payload/components/utilities';
import { Drawer, formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer';
import { useModal } from '@faceless-ui/modal';
import { Gutter } from 'payload/dist/admin/components/elements/Gutter';
import X from 'payload/dist/admin/components/icons/X';
import { EditorConfig } from '../../../../types';


const baseClass = "rich-text-clear-editor-drawer";

export function ClearEditorDrawer(props: {
    activeEditor: LexicalEditor;
    editorConfig: EditorConfig;
}): JSX.Element {

    const { activeEditor, editorConfig } = props;

    const editDepth = useEditDepth();

    const equationDrawerSlug = formatDrawerSlug({
        slug: `lexicalRichText-clear-editor`, // TODO: Add uuid for the slug?
        depth: editDepth,
    });

    const {
        toggleModal,
    } = useModal();


    return (
        <Drawer slug={equationDrawerSlug} key={equationDrawerSlug} className={baseClass}>
            <Gutter className={`${baseClass}__template`}>
                <header className={`${baseClass}__header`}>
                    <h2 className={`${baseClass}__header-text`}>Are you sure you want to clear the editor?</h2>
                    <Button
                        className={`${baseClass}__header-close`}
                        buttonStyle="none"
                        onClick={() => {
                            toggleModal(equationDrawerSlug);
                        }}
                    >
                        <X />
                    </Button>
                </header>
                <div className="Modal__content">
                    <Button
                        onClick={() => {
                            activeEditor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                            toggleModal(equationDrawerSlug);
                            activeEditor.focus();
                        }}
                    >
                        Clear
                    </Button>
                    {' '}
                    <Button
                        onClick={() => {
                            toggleModal(equationDrawerSlug);
                            activeEditor.focus();
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </Gutter>
        </Drawer>
    );

}
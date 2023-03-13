import { useBlockSuiteStore } from '@blocksuite/react';
import React from 'react';
import type {Page} from "@blocksuite/store";
import {Workspace} from "@blocksuite/store";

//import '@blocksuite/blocks';
// A workspace can hold multiple pages, and a page can hold multiple blocks.
//import { builtInSchemas } from '@blocksuite/blocks/models';
//import { EditorContainer } from '@blocksuite/editor';

import {Editor} from '@blocksuite/react/editor'
import {EditorContainer} from "@blocksuite/editor";
import { builtInSchemas } from '@blocksuite/blocks/models';

const presetMarkdown = `This example is designed to:
* ⚛️ Test react binding with BlockSuite.
For any feedback, please visit [BlockSuite issues](https://github.com/toeverything/blocksuite/issues) 📍`;
export default function BlockSuiteComponent() {
    let aa =  useBlockSuiteStore();
    let workspace = aa.currentWorkspace;

    workspace = workspace.register(builtInSchemas)


    workspace.slots.pageAdded.once(pageId => {
        const page = workspace.getPage(pageId) as Page;
        this.page = page;

        const editor = new EditorContainer();
        editor.page = page;
        this.appendChild(editor);

        const pageBlockId = page.addBlockByFlavour('affine:page', {
            title: new page.Text('Welcome to BlockSuite React example'),
        });
        const frameId = page.addBlockByFlavour('affine:frame', {}, pageBlockId);
        page.addBlockByFlavour('affine:paragraph', {}, frameId);
    });

    if(aa?.pages?.length == 0) {
        workspace.createPage("page0");
    }
    let page = workspace.getPage("page0");
    if(page) {
        if(aa.currentPage != page) {
            aa.setCurrentPage(page);
        }
        //aa.setCurrentWorkspace(workspace)
       // aa.setCurrentPage(page);
    }



    console.log("page", page);

    //const currentPage: Page = useBlockSuiteStore(store => store.currentPage);

    let LoadedEditor: any = null;


    return <>
        {<>
            {page ? <Editor
                page={() => page}

                            onInit={async (page, editor) => {
                              /*  const pageBlockId = page.addBlockByFlavour('affine:page', {
                                    title: new page.Text('Welcome to BlockSuite React example'),
                                });
                                page.addBlockByFlavour('affine:surface', {}, null);
                                const frameId = page.addBlockByFlavour(
                                    'affine:frame',
                                    {},
                                    pageBlockId
                                );
                                // Import preset markdown content inside frame block
                                await editor.clipboard.importMarkdown(presetMarkdown, frameId);
                                page.resetHistory();*/
                            }}
            /> : <div>Loading Page...</div>}
        </>}
    </>;
}

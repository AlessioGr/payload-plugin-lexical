import { Feature } from '../../types';
import * as React from "react";
import FloatingLinkEditorPlugin from './editor';
import LinkPlugin from './plugins/link';
import { LinkNode } from './nodes/LinkNodeModified';
import { AutoLinkNode } from './nodes/AutoLinkNodeModified';
import AutoLinkPlugin from './plugins/autoLink/';
import ClickableLinkPlugin from './plugins/clickableLink';

export function LinkFeature(props: {}): Feature { //TODO: Modularize link modal, toolbarplugin and floatingtexttoolbarplugin
    return {
        floatingAnchorElemPlugins: [
            (floatingAnchorElem) => <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} key="floatinglinkeditor" />,
        ],
        tablePlugins: [
            <LinkPlugin key="linkplugin" />,
            <ClickableLinkPlugin key="clickablelinkplugin" />,
        ],
        subEditorPlugins: [
            <LinkPlugin key="linkplugin" />,
        ],
        plugins: [
            {
                component: <LinkPlugin key="linkplugin" />,
            },
            {
                component: <ClickableLinkPlugin key="clickablelinkplugin" />,
            },
            {
                component: <AutoLinkPlugin key="autolinkplugin" />,
            }
        ],
        nodes: [
            LinkNode,
            AutoLinkNode
        ],
        tableCellNodes: [
            LinkNode,
            AutoLinkNode
        ],
      
    }
}
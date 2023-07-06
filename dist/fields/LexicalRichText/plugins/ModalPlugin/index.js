"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPEN_MODAL_COMMAND = void 0;
const React = __importStar(require("react"));
const TablePlugin_1 = require("../TablePlugin");
const UploadPlugin_1 = require("../UploadPlugin");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const modal_1 = require("@faceless-ui/modal");
const react_1 = require("react");
const EditDepth_1 = require("payload/dist/admin/components/utilities/EditDepth");
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
const utilities_1 = require("payload/components/utilities");
const LexicalEditorComponent_1 = require("../../LexicalEditorComponent");
const ListDrawer_1 = require("payload/dist/admin/components/elements/ListDrawer");
const modal_2 = require("../UploadPlugin/modal");
exports.OPEN_MODAL_COMMAND = (0, lexical_1.createCommand)('OPEN_MODAL_COMMAND');
function ModalPlugin(props) {
    const editorConfig = props.editorConfig;
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const { uuid } = (0, LexicalEditorComponent_1.useEditorConfigContext)();
    const { toggleModal = () => {
        console.log('Error: useModal() from FacelessUI did not work correctly');
    }, openModal, closeModal, isModalOpen = () => false, } = (0, modal_1.useModal)();
    const editDepth = (0, EditDepth_1.useEditDepth)();
    const addUploadDrawerSlug = (0, ListDrawer_1.formatListDrawerSlug)({
        uuid: uuid,
        depth: editDepth,
    });
    // Register commands:
    editor.registerCommand(exports.OPEN_MODAL_COMMAND, (toOpen) => {
        if (toOpen === 'upload') {
            toggleModal(addUploadDrawerSlug);
        }
        else if (toOpen === 'table') {
            const addTableDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
                slug: `lexicalRichText-add-table` + uuid,
                depth: editDepth,
            });
            toggleModal(addTableDrawerSlug);
        }
        else if (toOpen === 'newtable') {
            const addNewTableDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
                slug: `lexicalRichText-add-newtable` + uuid,
                depth: editDepth,
            });
            toggleModal(addNewTableDrawerSlug);
        }
        else {
            for (const feature of editorConfig.features) {
                if (feature.modals && feature.modals.length > 0) {
                    for (const featureModal of feature.modals) {
                        if (toOpen === featureModal.openModalCommand.type) {
                            featureModal.openModalCommand.command(toggleModal, editDepth, uuid);
                            return true;
                        }
                    }
                }
            }
        }
        return true;
    }, lexical_1.COMMAND_PRIORITY_NORMAL);
    const filterRichTextCollections = (collections, options) => {
        return collections.filter(({ admin: { enableRichTextRelationship }, upload }) => {
            if (options === null || options === void 0 ? void 0 : options.uploads) {
                return enableRichTextRelationship && Boolean(upload) === true;
            }
            return upload ? false : enableRichTextRelationship;
        });
    };
    const uploads = true; // TODO: what does it do?
    const { collections } = (0, utilities_1.useConfig)();
    const [enabledCollectionSlugs] = React.useState(() => filterRichTextCollections(collections, { uploads }).map(({ slug }) => slug));
    /*const [
      ListDrawer,
      _,
      { closeDrawer, openDrawer, toggleDrawer },
    ] = useListDrawer({
      uploads: true,
      collectionSlugs: enabledCollectionSlugs,
    });*/
    const onUploadSelect = (0, react_1.useCallback)(({ docID, collectionConfig }) => {
        insertUpload({
            value: {
                id: docID,
            },
            relationTo: collectionConfig.slug,
            activeEditor,
        });
        closeModal(addUploadDrawerSlug);
    }, [editor, closeModal]);
    const insertUpload = ({ value, relationTo, activeEditor }) => {
        console.log('insertUpload value:', value, 'relationTo:', relationTo);
        const imagePayload = {
            rawImagePayload: {
                value,
                relationTo,
            },
        };
        activeEditor.dispatchCommand(UploadPlugin_1.INSERT_IMAGE_COMMAND, imagePayload);
        console.log('Dispatched insert image command');
        // injectVoidElement(editor, upload);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(modal_2.ListDrawer, { onSelect: onUploadSelect, drawerSlug: addUploadDrawerSlug, collectionSlugs: enabledCollectionSlugs }),
        React.createElement(TablePlugin_1.InsertTableDialog, null),
        React.createElement(TablePlugin_1.InsertNewTableDialog, null),
        editorConfig.features.map((feature) => {
            if (feature.modals && feature.modals.length > 0) {
                return feature.modals.map((customModal) => {
                    return (customModal === null || customModal === void 0 ? void 0 : customModal.modal)
                        ? customModal.modal({ editorConfig })
                        : null;
                });
            }
        })));
}
exports.default = ModalPlugin;
//# sourceMappingURL=index.js.map
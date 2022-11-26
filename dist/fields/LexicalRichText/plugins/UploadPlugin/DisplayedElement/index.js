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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modal_1 = require("@faceless-ui/modal");
const react_i18next_1 = require("react-i18next");
const react_1 = __importStar(require("react"));
const Config_1 = require("payload/dist/admin/components/utilities/Config");
const usePayloadAPI_1 = __importDefault(require("payload/dist/admin/hooks/usePayloadAPI"));
const useThumbnail_1 = __importDefault(require("payload/dist/admin/hooks/useThumbnail"));
const File_1 = __importDefault(require("payload/dist/admin/components/graphics/File"));
const getTranslation_1 = require("payload/dist/utilities/getTranslation");
const Button_1 = __importDefault(require("payload/dist/admin/components/elements/Button"));
const SwapUploadModal_1 = require("payload/dist/admin/components/forms/field-types/RichText/elements/upload/Element/SwapUploadModal");
const EditModal_1 = require("payload/dist/admin/components/forms/field-types/RichText/elements/upload/Element/EditModal");
const baseClass = 'rich-text-upload';
const initialParams = {
    depth: 0,
};
const DisplayedElement = ({ attributes, children, element, path, fieldProps, activeEditor }) => {
    var _a, _b, _c, _d;
    const { relationTo, value } = element;
    const { toggleModal } = (0, modal_1.useModal)();
    const { collections, serverURL, routes: { api } } = (0, Config_1.useConfig)();
    const [modalToRender, setModalToRender] = (0, react_1.useState)(undefined);
    const [relatedCollection, setRelatedCollection] = (0, react_1.useState)(() => collections.find((coll) => coll.slug === relationTo));
    const { t, i18n } = (0, react_i18next_1.useTranslation)('fields');
    const modalSlug = `${path}-edit-upload-${modalToRender}`;
    // Get the referenced document
    const [{ data: upload }] = (0, usePayloadAPI_1.default)(`${serverURL}${api}/${relatedCollection.slug}/${value === null || value === void 0 ? void 0 : value.id}`, { initialParams });
    const thumbnailSRC = (0, useThumbnail_1.default)(relatedCollection, upload);
    // Remove upload element from editor
    const removeUpload = (0, react_1.useCallback)(() => {
        // TODO
    }, [ /* activeEditor, element] */]);
    const closeModal = (0, react_1.useCallback)(() => {
        toggleModal(modalSlug);
        setModalToRender(null);
    }, [toggleModal, modalSlug]);
    (0, react_1.useEffect)(() => {
        if (modalToRender) {
            toggleModal(modalSlug);
        }
    }, [modalToRender, toggleModal, modalSlug]);
    const fieldSchema = (_d = (_c = (_b = (_a = fieldProps === null || fieldProps === void 0 ? void 0 : fieldProps.admin) === null || _a === void 0 ? void 0 : _a.upload) === null || _b === void 0 ? void 0 : _b.collections) === null || _c === void 0 ? void 0 : _c[relatedCollection.slug]) === null || _d === void 0 ? void 0 : _d.fields;
    return (react_1.default.createElement("div", { className: [
            baseClass,
            ( /* selected && focused */true) && `${baseClass}--selected`,
        ].filter(Boolean).join(' '), contentEditable: false, ...attributes },
        react_1.default.createElement("div", { className: `${baseClass}__card` },
            react_1.default.createElement("div", { className: `${baseClass}__topRow` },
                react_1.default.createElement("div", { className: `${baseClass}__thumbnail` }, thumbnailSRC ? (react_1.default.createElement("img", { src: thumbnailSRC, alt: upload === null || upload === void 0 ? void 0 : upload.filename })) : (react_1.default.createElement(File_1.default, null))),
                react_1.default.createElement("div", { className: `${baseClass}__topRowRightPanel` },
                    react_1.default.createElement("div", { className: `${baseClass}__collectionLabel` }, (0, getTranslation_1.getTranslation)(relatedCollection.labels.singular, i18n)),
                    react_1.default.createElement("div", { className: `${baseClass}__actions` },
                        fieldSchema && (react_1.default.createElement(Button_1.default, { icon: "edit", round: true, buttonStyle: "icon-label", className: `${baseClass}__actionButton`, onClick: (e) => {
                                e.preventDefault();
                                setModalToRender('edit');
                            }, tooltip: t('general:edit') })),
                        react_1.default.createElement(Button_1.default, { icon: "swap", round: true, buttonStyle: "icon-label", className: `${baseClass}__actionButton`, onClick: (e) => {
                                e.preventDefault();
                                setModalToRender('swap');
                            }, tooltip: t('swapUpload') }),
                        react_1.default.createElement(Button_1.default, { icon: "x", round: true, buttonStyle: "icon-label", className: `${baseClass}__actionButton`, onClick: (e) => {
                                e.preventDefault();
                                removeUpload();
                            }, tooltip: t('removeUpload') })))),
            react_1.default.createElement("div", { className: `${baseClass}__bottomRow` },
                react_1.default.createElement("strong", null, upload === null || upload === void 0 ? void 0 : upload.filename))),
        children,
        modalToRender === 'swap' && (react_1.default.createElement(SwapUploadModal_1.SwapUploadModal, { slug: modalSlug, element: element, closeModal: closeModal, setRelatedCollectionConfig: setRelatedCollection, relatedCollectionConfig: relatedCollection })),
        (modalToRender === 'edit' && fieldSchema) && (react_1.default.createElement(EditModal_1.EditModal, { slug: modalSlug, closeModal: closeModal, relatedCollectionConfig: relatedCollection, fieldSchema: fieldSchema, element: element }))));
};
exports.default = DisplayedElement;

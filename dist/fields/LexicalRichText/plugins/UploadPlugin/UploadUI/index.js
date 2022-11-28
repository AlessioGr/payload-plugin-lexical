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
exports.UploadModal = void 0;
const react_1 = __importStar(require("react"));
const modal_1 = require("@faceless-ui/modal");
const react_i18next_1 = require("react-i18next");
const Config_1 = require("payload/dist/admin/components/utilities/Config");
const usePayloadAPI_1 = __importDefault(require("payload/dist/admin/hooks/usePayloadAPI"));
const UploadGallery_1 = __importDefault(require("payload/dist/admin/components/elements/UploadGallery"));
const ListControls_1 = __importDefault(require("payload/dist/admin/components/elements/ListControls"));
const ReactSelect_1 = __importDefault(require("payload/dist/admin/components/elements/ReactSelect"));
const Paginator_1 = __importDefault(require("payload/dist/admin/components/elements/Paginator"));
const formatFields_1 = __importDefault(require("payload/dist/admin/components/views/collections/List/formatFields"));
const Label_1 = __importDefault(require("payload/dist/admin/components/forms/Label"));
const Minimal_1 = __importDefault(require("payload/dist/admin/components/templates/Minimal"));
const Button_1 = __importDefault(require("payload/dist/admin/components/elements/Button"));
const PerPage_1 = __importDefault(require("payload/dist/admin/components/elements/PerPage"));
const getTranslation_1 = require("payload/dist/utilities/getTranslation");
require("./index.scss");
require("../addSwapModals.scss");
const index_1 = require("../index");
const baseClass = 'upload-rich-text-button';
const baseModalClass = 'rich-text-upload-modal';
const insertUpload = ({ value, relationTo, activeEditor, }) => {
    console.log('insertUpload value:', value, 'relationTo:', relationTo);
    const rawImagePayload = {
        value,
        relationTo,
    };
    activeEditor.dispatchCommand(index_1.INSERT_IMAGE_COMMAND, rawImagePayload);
    console.log('Dispatched insert image command');
    // injectVoidElement(editor, upload);
};
const UploadModal = ({ activeEditor }) => {
    var _a, _b;
    const { t, i18n, } = (0, react_i18next_1.useTranslation)('upload');
    const { toggleModal, } = (0, modal_1.useModal)();
    const { serverURL, routes: { api }, collections, } = (0, Config_1.useConfig)();
    const [availableCollections] = (0, react_1.useState)(() => collections.filter(({ admin: { enableRichTextRelationship }, upload, }) => (Boolean(upload) && enableRichTextRelationship)));
    const [modalCollectionOption, setModalCollectionOption] = (0, react_1.useState)(() => {
        const firstAvailableCollection = collections.find(({ admin: { enableRichTextRelationship }, upload, }) => (Boolean(upload) && enableRichTextRelationship));
        if (firstAvailableCollection) {
            return {
                label: (0, getTranslation_1.getTranslation)(firstAvailableCollection.labels.singular, i18n),
                value: firstAvailableCollection.slug,
            };
        }
        return undefined;
    });
    const [modalCollection, setModalCollection] = (0, react_1.useState)(() => collections.find(({ admin: { enableRichTextRelationship }, upload, }) => (Boolean(upload) && enableRichTextRelationship)));
    const [fields, setFields] = (0, react_1.useState)(() => (modalCollection ? (0, formatFields_1.default)(modalCollection, t) : undefined));
    const [limit, setLimit] = (0, react_1.useState)();
    const [sort, setSort] = (0, react_1.useState)(null);
    const [where, setWhere] = (0, react_1.useState)(null);
    const [page, setPage] = (0, react_1.useState)(null);
    const modalSlug = 'lexicalRichText-add-upload';
    const moreThanOneAvailableCollection = availableCollections.length > 1;
    // If modal is open, get active page of upload gallery
    const apiURL = `${serverURL}${api}/${modalCollection.slug}`;
    const [{ data }, { setParams }] = (0, usePayloadAPI_1.default)(apiURL, {});
    (0, react_1.useEffect)(() => {
        if (modalCollection) {
            setFields((0, formatFields_1.default)(modalCollection, t));
        }
    }, [modalCollection, t]);
    (0, react_1.useEffect)(() => {
        const params = {};
        if (page)
            params.page = page;
        if (where)
            params.where = where;
        if (sort)
            params.sort = sort;
        if (limit)
            params.limit = limit;
        setParams(params);
    }, [setParams, page, sort, where, limit]);
    (0, react_1.useEffect)(() => {
        if (modalCollectionOption) {
            setModalCollection(collections.find(({ slug }) => modalCollectionOption.value === slug));
        }
    }, [modalCollectionOption, collections]);
    if (!modalCollection) {
        return null;
    }
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(Minimal_1.default, { width: "wide" },
            react_1.default.createElement("header", { className: `${baseModalClass}__header` },
                react_1.default.createElement("h1", null, t('fields:addLabel', { label: (0, getTranslation_1.getTranslation)(modalCollection.labels.singular, i18n) })),
                react_1.default.createElement(Button_1.default, { icon: "x", round: true, buttonStyle: "icon-label", iconStyle: "with-border", onClick: () => {
                        toggleModal(modalSlug);
                    } })),
            moreThanOneAvailableCollection && (react_1.default.createElement("div", { className: `${baseModalClass}__select-collection-wrap` },
                react_1.default.createElement(Label_1.default, { label: t('selectCollectionToBrowse') }),
                react_1.default.createElement(ReactSelect_1.default, { className: `${baseClass}__select-collection`, value: modalCollectionOption, onChange: setModalCollectionOption, options: availableCollections.map((coll) => ({
                        label: (0, getTranslation_1.getTranslation)(coll.labels.singular, i18n),
                        value: coll.slug,
                    })) }))),
            react_1.default.createElement(ListControls_1.default, { collection: Object.assign(Object.assign({}, modalCollection), { fields }), enableColumns: false, enableSort: true, modifySearchQuery: false, handleSortChange: setSort, handleWhereChange: setWhere }),
            react_1.default.createElement(UploadGallery_1.default, { docs: data === null || data === void 0 ? void 0 : data.docs, collection: modalCollection, onCardClick: (doc) => {
                    insertUpload({
                        value: {
                            id: doc.id,
                        },
                        relationTo: modalCollection.slug,
                        activeEditor,
                    });
                    toggleModal(modalSlug);
                } }),
            react_1.default.createElement("div", { className: `${baseModalClass}__page-controls` },
                react_1.default.createElement(Paginator_1.default, { limit: data.limit, totalPages: data.totalPages, page: data.page, hasPrevPage: data.hasPrevPage, hasNextPage: data.hasNextPage, prevPage: data.prevPage, nextPage: data.nextPage, numberOfNeighbors: 1, onChange: setPage, disableHistoryChange: true }),
                (data === null || data === void 0 ? void 0 : data.totalDocs) > 0 && (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement("div", { className: `${baseModalClass}__page-info` },
                        data.page,
                        "-",
                        data.totalPages > 1 ? data.limit : data.totalDocs,
                        ' ',
                        t('general:of'),
                        ' ',
                        data.totalDocs),
                    react_1.default.createElement(PerPage_1.default, { limits: (_b = (_a = modalCollection === null || modalCollection === void 0 ? void 0 : modalCollection.admin) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b.limits, limit: limit, modifySearchParams: false, handleChange: setLimit })))))));
};
exports.UploadModal = UploadModal;
//# sourceMappingURL=index.js.map
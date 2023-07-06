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
exports.useListDrawer = exports.ListDrawer = void 0;
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
const ListDrawer_1 = require("payload/dist/admin/components/elements/ListDrawer");
const DrawerContent_1 = require("payload/dist/admin/components/elements/ListDrawer/DrawerContent");
const React = __importStar(require("react"));
const modal_1 = require("@faceless-ui/modal");
const utilities_1 = require("payload/components/utilities");
const Config_1 = require("payload/dist/admin/components/utilities/Config");
const react_1 = require("react");
const ListDrawer = (props) => {
    const { drawerSlug } = props;
    return (React.createElement(Drawer_1.Drawer, { slug: drawerSlug, className: ListDrawer_1.baseClass, header: false, gutter: false },
        React.createElement(DrawerContent_1.ListDrawerContent, Object.assign({}, props))));
};
exports.ListDrawer = ListDrawer;
const useListDrawer = ({ collectionSlugs: collectionSlugsFromProps, uploads, selectedCollection, filterOptions, }) => {
    const { collections } = (0, Config_1.useConfig)();
    const drawerDepth = (0, utilities_1.useEditDepth)();
    const uuid = (0, react_1.useId)();
    const { modalState, toggleModal, closeModal, openModal } = (0, modal_1.useModal)();
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [collectionSlugs, setCollectionSlugs] = (0, react_1.useState)(collectionSlugsFromProps);
    const drawerSlug = (0, ListDrawer_1.formatListDrawerSlug)({
        depth: drawerDepth,
        uuid,
    });
    (0, react_1.useEffect)(() => {
        var _a;
        setIsOpen(Boolean((_a = modalState[drawerSlug]) === null || _a === void 0 ? void 0 : _a.isOpen));
    }, [modalState, drawerSlug]);
    (0, react_1.useEffect)(() => {
        if (!collectionSlugs || collectionSlugs.length === 0) {
            const filteredCollectionSlugs = collections.filter(({ upload }) => {
                if (uploads) {
                    return Boolean(upload) === true;
                }
                return true;
            });
            setCollectionSlugs(filteredCollectionSlugs.map(({ slug }) => slug));
        }
    }, [collectionSlugs, uploads, collections]);
    const toggleDrawer = (0, react_1.useCallback)(() => {
        toggleModal(drawerSlug);
    }, [toggleModal, drawerSlug]);
    const closeDrawer = (0, react_1.useCallback)(() => {
        closeModal(drawerSlug);
    }, [drawerSlug, closeModal]);
    const openDrawer = (0, react_1.useCallback)(() => {
        openModal(drawerSlug);
    }, [drawerSlug, openModal]);
    const MemoizedDrawer = (0, react_1.useMemo)(() => {
        return (props) => (React.createElement(exports.ListDrawer, Object.assign({}, props, { drawerSlug: drawerSlug, collectionSlugs: collectionSlugs, uploads: uploads, closeDrawer: closeDrawer, key: drawerSlug, selectedCollection: selectedCollection, filterOptions: filterOptions })));
    }, [
        drawerSlug,
        collectionSlugs,
        uploads,
        closeDrawer,
        selectedCollection,
        filterOptions,
    ]);
    const MemoizedDrawerToggler = (0, react_1.useMemo)(() => {
        return (props) => React.createElement(ListDrawer_1.ListDrawerToggler, Object.assign({}, props, { drawerSlug: drawerSlug }));
    }, [drawerSlug]);
    const MemoizedDrawerState = (0, react_1.useMemo)(() => ({
        drawerSlug,
        drawerDepth,
        isDrawerOpen: isOpen,
        toggleDrawer,
        closeDrawer,
        openDrawer,
    }), [drawerDepth, drawerSlug, isOpen, toggleDrawer, closeDrawer, openDrawer]);
    return [MemoizedDrawer, MemoizedDrawerToggler, MemoizedDrawerState];
};
exports.useListDrawer = useListDrawer;
//# sourceMappingURL=index.js.map
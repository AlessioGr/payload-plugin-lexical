import { CollectionConfig } from "payload/types";



const Products: CollectionConfig = {
    slug: "products",
    admin: {
        useAsTitle: "title",
    },
    fields: [
        {
            name: "title",
            label: "Title",
            type: "text",
            required: true,
            localized: true,
        },
        {
            type: "tabs",
            tabs: [
                {
                    name: "product",
                    label: "Product Information", // required
                    fields: [
                        {
                            name: 'color', // required
                            type: 'radio', // required
                            options: [ // required
                                {
                                    label: 'Mint',
                                    value: 'mint',
                                },
                                {
                                    label: 'Dark Gray',
                                    value: 'dark_gray',
                                },
                            ],
                            defaultValue: 'mint', // The first value in options.
                            admin: {
                                layout: 'horizontal',
                            }
                        },
                        {
                            name: "alternatives",
                            label: "Alternative Products (if this one not available)",
                            type: "relationship",
                            relationTo: "products",
                            hasMany: true,
                        },
                        {
                            name: "shops", // required
                            type: "array", // required
                            label: "Shops",
                            minRows: 0,
                            maxRows: 10,
                            labels: {
                                singular: "Shop",
                                plural: "Shops",
                            },
                            fields: [
                                // required
                                {
                                    name: "shop",
                                    type: "text",
                                },
                                {
                                    name: "link",
                                    type: "text",
                                },
                                {
                                    name: "link_affiliate",
                                    type: "text",
                                    admin: {
                                        readOnly: true,
                                    },
                                },
                                {
                                    name: "available", // required
                                    type: "checkbox", // required
                                    label: "Available",
                                    defaultValue: true,
                                    admin: {
                                        readOnly: true,
                                    },
                                },
                                {
                                    name: "price",
                                    type: "number",
                                },
                                {
                                    name: "price_old",
                                    type: "number",
                                    admin: {
                                        readOnly: true,
                                    },
                                },
                                {
                                    name: "product_image_links",
                                    type: "array",
                                    fields: [
                                        {
                                            name: "link",
                                            label: "Link",
                                            type: "text",
                                        }
                                    ],
                                    admin: {
                                        readOnly: true,
                                    },
                                },
                                {
                                    name: "features",
                                    type: "array",
                                    fields: [
                                        {
                                            name: "feature",
                                            label: "Feature",
                                            type: "text",
                                        }
                                    ],
                                    admin: {
                                        readOnly: true,
                                    },
                                },
                                {
                                    name: "currency",
                                    type: "text",
                                },
                                {
                                    name: "last_checked",
                                    type: "date",
                                    admin: {
                                        readOnly: true,
                                        date: {
                                            pickerAppearance: "dayAndTime",
                                        }
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

export default Products;

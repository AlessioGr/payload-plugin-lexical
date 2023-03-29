import {updateShop as updateShopAmazon} from "./amazon";
import {updateShop as updateShopFanatec} from "./fanatec";

export type Shop = {
    shop: string|any;
    link: string;
    link_affiliate: string;
    id: string;
    available: boolean;
    price: number;
    price_old: number;
    currency: string; // e.g. EUR, USD, CAD
    last_checked: string;
    product_image_links: {link: string}[];
    features: {feature: string}[];
};

export async function getUpdatedProductShops(shops: { shops: Shop[] }): Promise<Shop[]> {
    if (!shops?.shops || shops.shops?.length < 1) {
        return null;
    }
    let newShops: Shop[] = [];
    for (let shop of shops.shops) {
        try {
            let newShop;
            console.log("Shop name", shop)
            if((shop?.shop?.name as string)?.toLowerCase() === "amazon" || shop?.shop == "63bb051e53c9a3b0f68c4a16"){
                newShop = await updateShopAmazon(shop);
            }else if((shop?.shop?.name as string)?.toLowerCase() === "fanatec" || shop?.shop == "64149c2c8a9e524f8e98f51d"){
                newShop = await updateShopFanatec(shop);
            }else {
                newShop = shop;
            }
            if(newShop?.shop?.id){
                newShop.shop = newShop.shop.id;
            }
            newShops.push(newShop);
        } catch (e) {
            console.error("Error updating shop", e);
        }
    }
    return newShops;
}

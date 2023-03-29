import cron from 'node-cron';
import payload from "payload";
import {getUpdatedProductShops, Shop} from "./affiliates/controller";


// Run this when express starts up in the server.ts
export function initCronJobs() {
    // Runs every 12 hours:
    cron.schedule(`0 */12 * * *`, async () => {
        console.log('running the update product task...');
        updateAllProducts();
    });

}

export async function updateAllProducts() {
    console.log('updating all products...');
    // Find all collections with slug 'products'
    const allProducts = await payload.find({
        collection: "products",
        depth: 0,
        limit: 1000,
    })
    for(let productCollection of allProducts.docs) {
        console.log("Updating ", productCollection.title, "...")

        getUpdatedProductShops({shops: productCollection.product.shops } as { shops: Shop[] }).then(
            async (updatedProducts) => {
                if (!updatedProducts) {
                    return;
                }
                if(productCollection.product.shops.length !== updatedProducts.length){
                    return;
                }
                if(productCollection.product.shops.length >= 1 && !updatedProducts[0]){
                    return;
                }

                if(productCollection?.product?.product_images && productCollection?.product?.product_images.length >= 1){
                    let counter = 0;
                    for(const image of productCollection?.product?.product_images){
                        counter++;
                        if(image?.product_images?.id){
                            productCollection.product.product_images[0].product_images = image?.product_images?.id;
                        }
                    }
                }

                console.log("Updating product product>shop with new data:", updatedProducts);
                // Update collection:
                 await payload.update({
                    collection: "products",
                    id: productCollection.id,
                    data: {
                        product: {
                            ...productCollection.product,
                            shops: updatedProducts
                        },
                    }
                });
            }
        );
    }
}

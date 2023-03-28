import {Shop} from "./controller";
import {GetItemsRequest, Host, Item, PartnerType, Region,} from "paapi5-typescript-sdk";

const accessKey = "secret";
const secretKey = "secret";
const partnerTag = "secret";
const partnerID = "secret";


export async function updateShop(shop: Shop) {
  console.log("shop", shop);

  let itemID = shop.link;
  if(shop.link.includes("/dp/")) {
    itemID = shop.link.split("/dp/")[1];
  }
  if(itemID.includes("/")){
    itemID = itemID.split("/")[0];
  }

  let cleanLink = shop.link
  if(shop.link.includes("/dp/")) {
    cleanLink = shop.link.split("/dp/")[0];
  }
  cleanLink = cleanLink + "/dp/" + itemID;
  const affiliateLink = cleanLink + "?tag=" + partnerTag;

  const amazonItem = await getAmazonItem(itemID);

  const images = await getImages(amazonItem);
  const features = await getFeatures(amazonItem);

  const priceAndCurrency = await getPriceAndCurrency(amazonItem);

  shop.price = priceAndCurrency.price;
  shop.price_old = priceAndCurrency.price_old;
  shop.currency = priceAndCurrency.currency;
  shop.last_checked = new Date().toString();
  shop.link_affiliate = affiliateLink;
  shop.link = cleanLink;
  shop.available = !!priceAndCurrency?.price;

  shop.product_image_links = [{link: images.primary.large}];
  shop.features = [];
  if(features && features.length > 0) {
    for (const feature of features) {
      shop.features.push({feature: feature});
    }
  }


  return shop;
}

export async function getAmazonItem(itemID: string): Promise<Item | null> {
  const request = new GetItemsRequest(
    {
      ItemIds: [itemID],
      Resources: [
        "ItemInfo.ProductInfo",
        "Offers.Listings.Price",
        "Offers.Listings.Availability.Type",
        "Offers.Listings.Condition",
        "Offers.Listings.SavingBasis",
        "Offers.Listings.MerchantInfo",
        "Offers.Listings.DeliveryInfo.IsAmazonFulfilled",
        "Offers.Listings.DeliveryInfo.IsFreeShippingEligible",
        "Offers.Listings.DeliveryInfo.IsPrimeEligible",
        "Offers.Summaries.LowestPrice",
        "Images.Primary.Large",
        "ItemInfo.Features",
        "ItemInfo.ProductInfo",
        "ItemInfo.TechnicalInfo",


      ],
    },
    partnerTag,
    PartnerType.ASSOCIATES,
    accessKey,
    secretKey,
    Host.GERMANY,
    Region.GERMANY
  );

  const res = await request.send();

  console.log("res.itemresult", res.ItemsResult);

  if (
    !res?.ItemsResult?.Items ||
    res?.ItemsResult?.Items?.length === 0 ||
    res?.ItemsResult?.Items[0]?.Offers?.Listings?.length === 0
  ) {
    return null;
  }

  const firstItem = res.ItemsResult.Items[0];

  return firstItem;
}

export async function getFeatures(amazonItem: Item): Promise<string[]> {
  return amazonItem?.ItemInfo?.Features?.DisplayValues as any;
}

export async function getPriceAndCurrency(amazonItem: Item) {
  const firstListing = amazonItem?.Offers?.Listings[0];

  return {
    price: firstListing?.Price?.Amount,
    price_old: firstListing?.SavingBasis?.Amount,
    currency: firstListing?.Price?.Currency,
  };
}

export async function getImages(amazonItem: Item) {
  const images = amazonItem.Images

  return {
    primary: {
      large: images.Primary.Large.URL
    }
  };
}


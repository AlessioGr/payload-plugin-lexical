import { Shop } from './controller';

export async function updateShop(shop: Shop) {
  let cleanLink = shop.link;

  if (shop.link.endsWith('/')) {
    cleanLink = shop.link.slice(0, -1);
  }

  shop.link_affiliate = cleanLink + '?utm_medium=secret';
  shop.link = cleanLink;

  return shop;
}

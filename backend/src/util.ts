import NodeCache from "node-cache";

export async function getAzDBPricePerGB(sizePriceCache: NodeCache): Promise<number> {
  const pricePerGig: number | undefined = sizePriceCache.get("AZ_PRICE_PER_GIG");
  if (pricePerGig !== undefined) return pricePerGig;
  const url =
    "https://prices.azure.com/api/retail/prices?$filter=productName eq 'Standard SSD Managed Disks' and location eq 'US East' and meterName eq 'E60 ZRS Disk'";
  const response = await fetch(url);
  const body = await response.json();
  const price = body.Items[0].retailPrice / 8192
  sizePriceCache.set("AZ_PRICE_PER_GIG", price);
  return price;
}

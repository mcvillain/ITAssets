export async function getAzDBPricePerGB(): Promise<number> {
  const url =
    "https://prices.azure.com/api/retail/prices?$filter=productName eq 'Standard SSD Managed Disks' and location eq 'US East' and meterName eq 'E60 ZRS Disk'";
  const response = await fetch(url);
  const body = await response.json();
  return body.Items[0].retailPrice / 8192;
}

import { toDataURL } from 'qrcode';

export async function generateQrCodeDataURL(url: string): Promise<string> {
  return await toDataURL(url);
}

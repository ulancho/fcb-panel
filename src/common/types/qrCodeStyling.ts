import type QRCodeStyling from 'qr-code-styling';

export type QrCodeStylingConstructor = typeof QRCodeStyling;
export type QrCodeStylingInstance = InstanceType<typeof QRCodeStyling>;

export type QrCodeStylingOptions = ConstructorParameters<QrCodeStylingConstructor>[0];
export type QrCodeStylingUpdateOptions = QrCodeStylingInstance['update'] extends (
  options: infer T,
) => unknown
  ? T
  : never;

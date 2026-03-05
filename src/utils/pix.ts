export function generatePixPayload(
  key: string,
  name: string,
  city: string,
  amount: number,
  transactionId: string = 'LOJINHA'
): string {
  const padLength = (val: string) => {
    return val.length.toString().padStart(2, '0') + val;
  };

  const padIdAndLength = (id: string, val: string) => {
    return id + padLength(val);
  };

  const gui = padIdAndLength('00', 'br.gov.bcb.pix');
  const keyStr = padIdAndLength('01', key);
  const merchantAccountInfo = padIdAndLength('26', gui + keyStr);

  let payload = 
    padIdAndLength('00', '01') + // Payload Format Indicator
    merchantAccountInfo + // Merchant Account Info
    padIdAndLength('52', '0000') + // Merchant Category Code
    padIdAndLength('53', '986') + // Currency: BRL
    padIdAndLength('54', amount.toFixed(2)) + // Amount
    padIdAndLength('58', 'BR') + // Country Code
    padIdAndLength('59', name) + // Name
    padIdAndLength('60', city) + // City
    padIdAndLength('62', padIdAndLength('05', transactionId)) + // TX ID
    '6304'; // CRC16 format

  // Calculate CRC16 CCITT (polynomial 0x1021, initial value 0xFFFF)
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) > 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }

  const crcHEx = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return payload + crcHEx;
}

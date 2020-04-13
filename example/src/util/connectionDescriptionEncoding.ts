import { Base64 } from 'js-base64';

import { ConnectionDescription } from '../module/PeerConnection/PeerConnection';

export function encode(connectionDescription: ConnectionDescription): string {
  return Base64.encode(JSON.stringify(connectionDescription));
}

export function decode(connectionDescriptionCode: string): ConnectionDescription {
  return JSON.parse(Base64.decode(connectionDescriptionCode));
}

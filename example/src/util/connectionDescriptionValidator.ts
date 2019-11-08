import { createVadidator } from 'schemat';

const nonEmptyStringValidator = (d: any) => (typeof d === 'string' && d.length > 0 ? undefined : 'required');

export const connectionDescriptionValidator = createVadidator({
  description: nonEmptyStringValidator,
  encryptionKey: nonEmptyStringValidator,
});

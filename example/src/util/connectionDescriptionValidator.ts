import { createValidator } from 'schemat';

const nonEmptyStringValidator = (d: any) => (typeof d === 'string' && d.length > 0 ? undefined : 'required');

export const connectionDescriptionValidator = createValidator({
  description: nonEmptyStringValidator,
  encryptionKey: nonEmptyStringValidator,
});

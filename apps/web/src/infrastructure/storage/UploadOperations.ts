import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

import { storage } from '~/lib/firebase'

export const uploadImage = async (
  path: string,
  blob: Blob
): Promise<string> => {
  const imageRef = ref(storage, path)
  const snapShot = await uploadBytesResumable(imageRef, blob)
  return getDownloadURL(snapShot.ref)
}

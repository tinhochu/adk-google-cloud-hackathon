import { type FileRouter, createUploadthing } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  voiceUploader: f({
    audio: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '16MB',
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ metadata, file }) => {
    return { ...file }
  }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

import { z } from "zod"

export const NotificationsMetadata = z.object({

})

export const NotificationSchema = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    is_read: z.boolean(),
    timestamp: z.number(),
    metadata: NotificationsMetadata,
})



export type NotificationInterface = z.infer<typeof NotificationSchema>
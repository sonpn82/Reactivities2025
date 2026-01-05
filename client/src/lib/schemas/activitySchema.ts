import {z} from 'zod'

const requiredString = (fieldName: string) => 
  z.string({message: `${fieldName} is required`}).min(1, {
  message: `${fieldName} is required`
})

export const activitySchema = z.object({
  title: requiredString("Title"),
  description: requiredString("Description"),
  category: requiredString("Category"),
  date: z.date(),
  location: z.object({
    city: z.string().optional(),
    venue: requiredString("Venue"),
    latitude: z.number(),
    longitude: z.number(),
  })
})

export type ActivitySchema = z.infer<typeof activitySchema>
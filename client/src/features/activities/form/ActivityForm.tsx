import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";
import { useForm } from 'react-hook-form'
import { useEffect } from "react";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import LocationInput from "../../../app/shared/components/LocationInput";

export default function ActivityForm() {

  const { reset, control, handleSubmit } = useForm<ActivitySchema>({
    mode: 'onTouched',
    resolver: zodResolver(activitySchema)
  })
  const navitate = useNavigate()
  const { id } = useParams()
  const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id)

  useEffect(() => {
    if (activity) reset({
      ...activity,
      date: activity.date ? new Date(activity.date) : new Date(),
      location: {
        venue: activity.venue,
        city: activity.city,
        latitude: activity.latitude,
        longitude: activity.longitude
      }
    })
  }, [activity, reset])

  const onSubmit = async (data: ActivitySchema) => {
    const date = data.date instanceof Date ? data.date : new Date()
    const {location, ...rest} = data       
  
    const flattendData = {
      ...rest,
      ...location
    }
    try {
      if (activity) {
        updateActivity.mutate({...activity, ...flattendData}, {
          onSuccess: () => navitate(`/activities/${activity.id}`)
        })
      } else {
        createActivity.mutate({...flattendData, date}, {
          onSuccess: (id) => navitate(`/activities/${id}`)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoadingActivity) return <Typography>Loading activity...</Typography>

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {activity ? 'Edit activity' : 'Create Activity'}
      </Typography>
      <Box
        component='form'
        display='flex'
        flexDirection='column'
        gap={3}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput label='Title' control={control} name='title' />
        <TextInput label='Description' control={control} name='description' />
        <Box display='flex' gap={3}>
          <SelectInput label='Category' items={categoryOptions} control={control} name='category' />
          <DateTimeInput label='Date' control={control} name='date' />
        </Box>

        <LocationInput label="Enter the location" name="location" control={control} />

        <Box display='flex' justifyContent='end' gap={3}>
          <Button
            color="inherit"
          >Cancel</Button>
          <Button
            type="submit"
            color="success"
            variant="contained"
            disabled={updateActivity.isPending || createActivity.isPending}
          >Submit</Button>
        </Box>
      </Box>
    </Paper>
  )
}

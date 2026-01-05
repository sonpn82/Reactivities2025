import { Box, debounce, List, ListItemButton, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form"

type Props<T extends FieldValues> = {
  label: string
} & UseControllerProps<T>

export default function LocationInput<T extends FieldValues>(props: Props<T>) {
  const {field, fieldState} = useController({...props})
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([])
  const [inputValue, setInputValue] = useState(field.value || '')

  useEffect(() => {
    if (field.value && typeof field.value === 'object') {
      setInputValue(field.value.venue || '')
    } else {
      setInputValue(field.value || '')
    }
  }, [field.value])

  const locationUrl = 'https://api.locationiq.com/v1/autocomplete?key=pk.2b637994d0137c1f8a1e324d7a9c7de9&limit=5&dedupe=1&'

  const fetchSuggestions = useMemo(
    () => debounce(async (query: string) => {
      if (!query || query.length < 3) {
        setSuggestions([])
        return
      }

      setLoading(true)

      try {
        const response = await axios.get<LocationIQSuggestion[]>(`${locationUrl}q=${query}`)
        setSuggestions(response.data)
     
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }

    }, 500), [locationUrl]
  )

  const handleChange = async (value: string) => {
    field.onChange(value)
    await fetchSuggestions(value)
  }

  const handleSelect = (location: LocationIQSuggestion) => {
    const city = location.address?.city || location.address?.town || location.address?.village || ''
    const venue = location.display_name
    const latitude = parseFloat(location.lat)
    const longitude = parseFloat(location.lon)

    setInputValue(venue)
    field.onChange({venue, city, latitude, longitude})
    setSuggestions([])
  }

  return (
    <Box>
      <TextField 
        {...props}
        // {...field}
        value={inputValue}
        onChange={e => handleChange(e.target.value)}
        fullWidth
        variant="outlined"
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
      {loading && <Typography>Loading...</Typography>}
      {suggestions.length > 0 && (
        <List sx={{border: 1}}>
          {suggestions.map(suggestion => (
            <ListItemButton
              divider
              key={suggestion.place_id}
              onClick={() => {handleSelect(suggestion)}}
            >
              {suggestion.display_name}
            </ListItemButton>
          ))}
        </List>      
      )}
    </Box>
  )
}

import { axios } from "@/lib/axios"
import { useAuth } from "@/providers/AuthProvider"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useGeolocation } from "./useGeolocation"

export function useTriggerEmergencyAlert() {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  const queryKey = ["user_in_emergency"]
  const data = useGeolocation()

  return useMutation({
    mutationFn: async () => {
      await axios.post(
        "/emergency/alert",
        {
          locationLat: data?.latitute ?? -14.083723,
          locationLon: data?.longitude ?? -75.742533
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      queryClient.setQueryData(queryKey, true)
    },
    onError: () => {
      queryClient.setQueryData(queryKey, false)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
    }
  })
}

export function useCancelEmergencyAlert() {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  const queryKey = ["user_in_emergency"]

  return useMutation({
    mutationFn: async () => {
      await axios.post(
        "/emergency/cancel",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      queryClient.setQueryData(queryKey, false)
    },
    onError: () => {
      queryClient.setQueryData(queryKey, true)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
    }
  })
}
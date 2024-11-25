import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { RefreshCwIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import Map, { Layer, MapMouseEvent, Marker, Source } from "react-map-gl"

// Asegúrate de reemplazar esto con tu token de Mapbox
const MAPBOX_TOKEN =
  "pk.eyJ1IjoianVsaW9uYW1lYm90IiwiYSI6ImNtMzl2YmdpZjE4MTQyanBweWJ2NW0xaXgifQ.w18DiHEqFoyadsAI0-CldA"

const lineLayer = {
  id: "route",
  type: "line",
  layout: {
    "line-join": "round",
    "line-cap": "round"
  },
  paint: {
    "line-color": "#3887be",
    "line-width": 5,
    "line-opacity": 0.75
  }
} as const

interface Coordinates {
  longitude: number
  latitude: number
}

async function getRoute(start: Coordinates, end: Coordinates) {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`
  )
  const json = await query.json()
  const data = json.routes[0]
  return {
    type: "Feature",
    properties: {},
    geometry: data.geometry
  }
}

export default function SecurePath() {
  const [viewport, setViewport] = useState({
    longitude: -75.73608,
    latitude: -14.071553,
    zoom: 14
  })

  const [startPoint, setStartPoint] = useState<Coordinates | null>(null)
  const [endPoint, setEndPoint] = useState<Coordinates | null>(null)

  const handleClick = useCallback(
    (event: MapMouseEvent) => {
      const [longitude, latitude] = event.lngLat.toArray()
      if (!startPoint) {
        setStartPoint({ longitude, latitude })
      } else if (!endPoint) {
        setEndPoint({ longitude, latitude })
      }
    },
    [startPoint, endPoint]
  )

  const { data: route } = useQuery({
    queryKey: ["secure-path", startPoint, endPoint],
    queryFn: () => getRoute(startPoint!, endPoint!),
    enabled: Boolean(startPoint && endPoint)
  })
  const mapRef = useRef<mapboxgl.Map | null>(null)


  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize()
    }
  }, [])

  function refresh(){
    setStartPoint(null)
    setEndPoint(null)
  }

  return (
    <>
      
    <div className="fixed inset-0 z-0">
    <Button className="absolute top-20 right-4 z-50" onClick={refresh}><RefreshCwIcon className="size-4"/></Button>
      <Map
        {...viewport}
        ref={instance => {
          mapRef.current = instance && instance.getMap()
        }}
        onMove={evt => setViewport(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        
        style={{ width: "100%", height: "100%" }}
        onClick={handleClick}
      >
        {startPoint && (
          <Marker
            longitude={startPoint.longitude}
            latitude={startPoint.latitude}
            color="red"
          />
        )}
        {endPoint && (
          <Marker
            longitude={endPoint.longitude}
            latitude={endPoint.latitude}
            color="green"
          />
        )}
        {route && (
          <Source id="route" type="geojson" data={route}>
            <Layer {...lineLayer} />
          </Source>
        )}
      </Map>
    </div>
    </>
  )
}

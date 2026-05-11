import React from 'react'
import type { PlaneDetailed } from '../../types/domain.ts'
import { DetailRow } from './DetailRow.tsx'
import { DetailSection } from './DetailSection.tsx'
import {
  formatAltitude,
  formatSpeed,
  formatHeading,
  formatVerticalSpeed,
  formatDuration,
  formatArrivalTime,
  formatPassengers,
  formatPosition,
} from './utils/format.ts'

export function DetailPanelContent({
  plane,
}: {
  plane: PlaneDetailed
}): React.ReactElement {
  return (
    <>
      {/* Flight Info */}
      <DetailSection title="Flight Information">
        <DetailRow label="Flight Number" value={plane.flightNumber} />
        <DetailRow label="Airline" value={plane.airline} />
        <DetailRow label="Aircraft Model" value={plane.model} />
        <DetailRow label="Registration" value={plane.registration} />
        <DetailRow
          label="Status"
          value={plane.status.charAt(0).toUpperCase() + plane.status.slice(1)}
        />
      </DetailSection>

      {/* Route */}
      <DetailSection title="Route">
        <div className="flex items-center justify-between py-2">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-800">
              {plane.origin.airport}
            </div>
            <div className="text-xs text-slate-500">{plane.origin.city}</div>
          </div>
          <div className="px-2 text-slate-400">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-800">
              {plane.destination.airport}
            </div>
            <div className="text-xs text-slate-500">
              {plane.destination.city}
            </div>
          </div>
        </div>
      </DetailSection>

      {/* Position */}
      <DetailSection title="Position">
        <DetailRow
          label="Coordinates"
          value={formatPosition(plane.latitude, plane.longitude)}
        />
        <DetailRow label="Altitude" value={formatAltitude(plane.altitude)} />
        <DetailRow label="Speed" value={formatSpeed(plane.speed)} />
        <DetailRow label="Heading" value={formatHeading(plane.heading)} />
        <DetailRow
          label="Vertical Speed"
          value={formatVerticalSpeed(plane.verticalSpeed)}
        />
      </DetailSection>

      {/* Flight Time */}
      <DetailSection title="Flight Time">
        <DetailRow
          label="Duration"
          value={formatDuration(plane.flightDuration)}
        />
        <DetailRow
          label="Estimated Arrival"
          value={formatArrivalTime(plane.estimatedArrival)}
        />
      </DetailSection>

      {/* Passengers */}
      <DetailSection title="Passengers">
        <DetailRow
          label="Onboard"
          value={formatPassengers(
            plane.numberOfPassengers,
            plane.maxPassengers
          )}
        />
        <div className="mt-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${(plane.numberOfPassengers / plane.maxPassengers) * 100}%`,
              }}
            />
          </div>
        </div>
      </DetailSection>
    </>
  )
}

import { useCallback, useRef, useState } from 'react'

export interface WalletPassPreviewProps {
  platform: 'apple' | 'google'
  eventName: string
  eventDate: string
  eventTime: string
  venueName: string
  venueLocation: string
  ticketHolder: string
  ticketType: string
  seatSection: string
  seatRow: string
  seatNumber: string
  backgroundColor: string
  foregroundColor: string
  labelColor: string
  logoUrl: string
  stripImageUrl: string
  barcodeType: 'QR' | 'PDF417' | 'Aztec' | 'Code128'
  onLogoUpload: (dataUrl: string) => void
  onStripImageUpload: (dataUrl: string) => void
}

function getContrastColor(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff'
}

function ImageDropZone({
  label,
  dimSpec,
  imageUrl,
  onUpload,
  className = '',
  style,
  objectFit = 'cover',
}: {
  label: string
  dimSpec: string
  imageUrl: string
  objectFit?: 'cover' | 'contain'
  onUpload: (dataUrl: string) => void
  className?: string
  style?: React.CSSProperties
}) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) onUpload(e.target.result as string)
      }
      reader.readAsDataURL(file)
    },
    [onUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  if (imageUrl) {
    return (
      <div
        className={`group/img relative cursor-pointer overflow-hidden ${className}`}
        style={style}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit }} />
        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-colors flex items-center justify-center">
          <span className="text-[11px] font-medium text-white opacity-0 group-hover/img:opacity-100 transition-opacity">
            Replace
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${className}`}
      style={{
        ...style,
        border: dragOver ? '2px solid rgba(255,255,255,0.6)' : '2px dashed rgba(255,255,255,0.25)',
        background: dragOver ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <span className="text-[10px] font-medium opacity-50">{label}</span>
      <span className="text-[9px] opacity-35">{dimSpec}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}

function BarcodeBlock({
  type,
  fgColor,
  bgColor,
}: {
  type: string
  fgColor: string
  bgColor: string
}) {
  const isQR = type === 'QR' || type === 'Aztec'

  return (
    <div className="flex flex-col items-center gap-1.5 py-3">
      <div
        className="flex items-center justify-center rounded-md"
        style={{
          width: isQR ? 80 : 160,
          height: isQR ? 80 : 44,
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {isQR ? (
          <svg width="56" height="56" viewBox="0 0 7 7" fill={fgColor} opacity={0.2}>
            <rect x="0" y="0" width="3" height="3" />
            <rect x="4" y="0" width="3" height="3" />
            <rect x="0" y="4" width="3" height="3" />
            <rect x="3" y="3" width="1" height="1" />
            <rect x="5" y="5" width="1" height="1" />
          </svg>
        ) : (
          <div className="flex items-end gap-px h-7">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: Math.random() > 0.5 ? 2 : 1,
                  height: `${60 + Math.random() * 40}%`,
                  backgroundColor: fgColor,
                  opacity: 0.2,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <span style={{ color: bgColor === '#ffffff' ? '#999' : fgColor }} className="text-[9px] opacity-50">
        {type}
      </span>
    </div>
  )
}

function ApplePass(props: WalletPassPreviewProps) {
  const { backgroundColor, foregroundColor, labelColor } = props

  return (
    <div
      className="w-[340px] rounded-2xl overflow-hidden"
      style={{
        backgroundColor,
        color: foregroundColor,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <ImageDropZone
            label="Logo"
            dimSpec="160x50"
            imageUrl={props.logoUrl}
            onUpload={props.onLogoUpload}
            objectFit="contain"
            className="h-[28px] w-[56px] rounded"
            style={{ color: foregroundColor }}
          />
          <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: labelColor }}>
            {props.ticketType || 'Ticket'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider block" style={{ color: labelColor }}>
            Date
          </span>
          <span className="text-[11px] font-medium">{props.eventDate || '--'}</span>
        </div>
      </div>

      {/* Strip image */}
      <ImageDropZone
        label="Strip Image"
        dimSpec="375 x 98 @1x"
        imageUrl={props.stripImageUrl}
        onUpload={props.onStripImageUpload}
        className="w-full h-[90px]"
        style={{ color: foregroundColor }}
      />

      {/* Primary field */}
      <div className="px-5 pt-4 pb-1">
        <span className="text-[10px] uppercase tracking-wider block" style={{ color: labelColor }}>
          Event
        </span>
        <span className="text-[20px] font-semibold leading-tight block mt-0.5">
          {props.eventName || 'Event Name'}
        </span>
      </div>

      {/* Secondary fields */}
      <div className="px-5 py-2 flex justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider block" style={{ color: labelColor }}>
            Venue
          </span>
          <span className="text-[13px] block mt-0.5">{props.venueName || '--'}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider block" style={{ color: labelColor }}>
            Time
          </span>
          <span className="text-[13px] block mt-0.5">{props.eventTime || '--'}</span>
        </div>
      </div>

      {/* Auxiliary fields */}
      {(props.seatSection || props.seatRow || props.seatNumber) && (
        <div className="px-5 py-2 flex gap-6">
          {props.seatSection && (
            <div>
              <span className="text-[10px] uppercase tracking-wider block" style={{ color: labelColor }}>
                Section
              </span>
              <span className="text-[13px] block mt-0.5">{props.seatSection}</span>
            </div>
          )}
          {props.seatRow && (
            <div>
              <span className="text-[10px] uppercase tracking-wider block" style={{ color: labelColor }}>
                Row
              </span>
              <span className="text-[13px] block mt-0.5">{props.seatRow}</span>
            </div>
          )}
          {props.seatNumber && (
            <div>
              <span className="text-[10px] uppercase tracking-wider block" style={{ color: labelColor }}>
                Seat
              </span>
              <span className="text-[13px] block mt-0.5">{props.seatNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* Ticket holder */}
      <div className="px-5 py-2">
        <span className="text-[10px] uppercase tracking-wider block" style={{ color: labelColor }}>
          Ticket Holder
        </span>
        <span className="text-[13px] block mt-0.5">{props.ticketHolder || '--'}</span>
      </div>

      {/* Barcode */}
      <div
        className="mx-5 mb-4 mt-2 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
      >
        <BarcodeBlock type={props.barcodeType} fgColor={foregroundColor} bgColor={backgroundColor} />
      </div>
    </div>
  )
}

function GooglePass(props: WalletPassPreviewProps) {
  const { backgroundColor } = props
  const textColor = getContrastColor(backgroundColor)
  const labelOpacity = textColor === '#ffffff' ? 'opacity-50' : 'opacity-45'

  return (
    <div
      className="w-[340px] rounded-2xl overflow-hidden"
      style={{
        backgroundColor,
        color: textColor,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {/* Hero image */}
      <ImageDropZone
        label="Hero Image"
        dimSpec="1032 x 336"
        imageUrl={props.stripImageUrl}
        onUpload={props.onStripImageUpload}
        className="w-full h-[110px]"
        style={{ color: textColor }}
      />

      {/* Logo + event name row */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <ImageDropZone
          label="Logo"
          dimSpec="660x660"
          imageUrl={props.logoUrl}
          onUpload={props.onLogoUpload}
          objectFit="contain"
          className="h-[32px] w-[32px] rounded-full shrink-0 overflow-hidden"
          style={{ color: textColor }}
        />
        <div className="min-w-0">
          <span className="text-[17px] font-semibold leading-tight block truncate">
            {props.eventName || 'Event Name'}
          </span>
          <span className={`text-[12px] block mt-0.5 ${labelOpacity}`}>{props.venueName || 'Venue'}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 my-2" style={{ borderTop: `1px solid ${textColor === '#ffffff' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}` }} />

      {/* Date / Time row */}
      <div className="px-5 py-2 flex justify-between">
        <div>
          <span className={`text-[10px] uppercase tracking-wider block ${labelOpacity}`}>Date</span>
          <span className="text-[13px] block mt-0.5">{props.eventDate || '--'}</span>
        </div>
        <div className="text-right">
          <span className={`text-[10px] uppercase tracking-wider block ${labelOpacity}`}>Time</span>
          <span className="text-[13px] block mt-0.5">{props.eventTime || '--'}</span>
        </div>
      </div>

      {/* Section / Row / Seat row */}
      {(props.seatSection || props.seatRow || props.seatNumber) && (
        <div className="px-5 py-2 flex gap-6">
          {props.seatSection && (
            <div>
              <span className={`text-[10px] uppercase tracking-wider block ${labelOpacity}`}>Section</span>
              <span className="text-[13px] block mt-0.5">{props.seatSection}</span>
            </div>
          )}
          {props.seatRow && (
            <div>
              <span className={`text-[10px] uppercase tracking-wider block ${labelOpacity}`}>Row</span>
              <span className="text-[13px] block mt-0.5">{props.seatRow}</span>
            </div>
          )}
          {props.seatNumber && (
            <div>
              <span className={`text-[10px] uppercase tracking-wider block ${labelOpacity}`}>Seat</span>
              <span className="text-[13px] block mt-0.5">{props.seatNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* Ticket holder */}
      <div className="px-5 py-2">
        <span className={`text-[10px] uppercase tracking-wider block ${labelOpacity}`}>Ticket Holder</span>
        <span className="text-[13px] block mt-0.5">{props.ticketHolder || '--'}</span>
      </div>

      {/* Barcode */}
      <div
        className="mx-5 mb-4 mt-2 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: textColor === '#ffffff' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }}
      >
        <BarcodeBlock type={props.barcodeType} fgColor={textColor} bgColor={backgroundColor} />
      </div>
    </div>
  )
}

export function WalletPassPreview(props: WalletPassPreviewProps) {
  return props.platform === 'apple' ? <ApplePass {...props} /> : <GooglePass {...props} />
}

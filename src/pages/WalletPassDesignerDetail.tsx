import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ExportDialog } from '@/components/ExportDialog'
import { WalletPassPreview } from '@/components/ui/wallet-pass-preview'
import { ArrowLeft, Code } from 'lucide-react'

type Platform = 'apple' | 'google'
type BarcodeType = 'QR' | 'PDF417' | 'Aztec' | 'Code128'

function hexToRgb(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return `rgb(${r}, ${g}, ${b})`
}

function barcodeFormatApple(type: BarcodeType): string {
  const map: Record<BarcodeType, string> = {
    QR: 'PKBarcodeFormatQR',
    PDF417: 'PKBarcodeFormatPDF417',
    Aztec: 'PKBarcodeFormatAztec',
    Code128: 'PKBarcodeFormatCode128',
  }
  return map[type]
}

function generateAppleJson(state: {
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
  barcodeType: BarcodeType
}): string {
  const json = {
    formatVersion: 1,
    passTypeIdentifier: 'pass.com.yourteam.devcon',
    teamIdentifier: '<TEAM_ID>',
    organizationName: 'Devcon',
    description: `${state.eventName || 'Devcon'} Event Ticket`,
    backgroundColor: hexToRgb(state.backgroundColor),
    foregroundColor: hexToRgb(state.foregroundColor),
    labelColor: hexToRgb(state.labelColor),
    eventTicket: {
      headerFields: [
        { key: 'ticketType', label: 'TICKET', value: state.ticketType || 'General Admission' },
      ],
      primaryFields: [
        { key: 'eventName', label: 'EVENT', value: state.eventName || 'Event Name' },
      ],
      secondaryFields: [
        { key: 'venue', label: 'VENUE', value: state.venueName || 'Venue' },
        { key: 'date', label: 'DATE', value: state.eventDate || 'Date' },
      ],
      auxiliaryFields: [
        ...(state.seatSection ? [{ key: 'section', label: 'SECTION', value: state.seatSection }] : []),
        ...(state.seatRow ? [{ key: 'row', label: 'ROW', value: state.seatRow }] : []),
        ...(state.seatNumber ? [{ key: 'seat', label: 'SEAT', value: state.seatNumber }] : []),
      ],
      backFields: [
        { key: 'holder', label: 'Ticket Holder', value: state.ticketHolder || 'Name' },
      ],
    },
    barcodes: [
      {
        format: barcodeFormatApple(state.barcodeType),
        message: '<ticket-id>',
        messageEncoding: 'iso-8859-1',
      },
    ],
  }
  return JSON.stringify(json, null, 2)
}

function generateGoogleJson(state: {
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
  barcodeType: BarcodeType
}): string {
  const localizedString = (value: string) => ({
    defaultValue: { language: 'en', value },
  })

  const json = {
    id: '<ISSUER_ID>.devcon-event',
    issuerName: 'Devcon',
    eventName: localizedString(state.eventName || 'Event Name'),
    venue: {
      name: localizedString(state.venueName || 'Venue'),
      address: localizedString(state.venueLocation || 'Location'),
    },
    dateTime: {
      start: '2026-04-15T19:00:00',
    },
    hexBackgroundColor: state.backgroundColor,
    logo: { sourceUri: { uri: '<LOGO_URL>' } },
    heroImage: { sourceUri: { uri: '<HERO_URL>' } },
    classTemplateInfo: {
      cardTemplateOverride: {
        cardRowTemplateInfos: [
          {
            twoItems: {
              startItem: {
                firstValue: {
                  fields: [{ fieldPath: "object.textModulesData['date']" }],
                },
              },
              endItem: {
                firstValue: {
                  fields: [{ fieldPath: "object.textModulesData['time']" }],
                },
              },
            },
          },
          ...(state.seatSection || state.seatRow || state.seatNumber
            ? [
                {
                  threeItems: {
                    startItem: {
                      firstValue: {
                        fields: [{ fieldPath: "object.textModulesData['section']" }],
                      },
                    },
                    middleItem: {
                      firstValue: {
                        fields: [{ fieldPath: "object.textModulesData['row']" }],
                      },
                    },
                    endItem: {
                      firstValue: {
                        fields: [{ fieldPath: "object.textModulesData['seat']" }],
                      },
                    },
                  },
                },
              ]
            : []),
        ],
      },
    },
    textModulesData: [
      { id: 'date', header: 'DATE', body: state.eventDate || 'Date' },
      { id: 'time', header: 'TIME', body: state.eventTime || 'Time' },
      ...(state.seatSection ? [{ id: 'section', header: 'SECTION', body: state.seatSection }] : []),
      ...(state.seatRow ? [{ id: 'row', header: 'ROW', body: state.seatRow }] : []),
      ...(state.seatNumber ? [{ id: 'seat', header: 'SEAT', body: state.seatNumber }] : []),
      { id: 'holder', header: 'TICKET HOLDER', body: state.ticketHolder || 'Name' },
    ],
  }
  return JSON.stringify(json, null, 2)
}

const IMAGE_SPECS = `IMAGE SPECIFICATIONS
====================

Apple Wallet:
  Logo:        160x50 @1x / 320x100 @2x / 480x150 @3x (PNG, transparent bg)
  Strip Image: 375x98 @1x / 750x196 @2x / 1125x294 @3x (PNG)
  Icon:        29x29 @1x / 58x58 @2x / 87x87 @3x (PNG)

Google Wallet:
  Logo:        660x660 px (PNG, circle-cropped, 15% safe margin)
  Hero Image:  1032x336 px (PNG, 3:1 aspect ratio)

IMPLEMENTATION NOTES
====================

Apple:
  - Requires Apple Developer account + Pass Type ID certificate
  - Pass must be signed with PassKit tools
  - Colors use rgb() format: rgb(R, G, B)
  - Docs: https://developer.apple.com/wallet/

Google:
  - Requires Google Wallet API issuer account
  - Text color auto-adjusts: white on dark bg, black on light bg
  - Colors use hex format: #RRGGBB
  - Docs: https://developers.google.com/wallet/tickets/events`

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length
  if (len < max * 0.7) return null
  return (
    <span
      className={`text-[11px] tabular-nums ${len >= max ? 'text-red-500' : 'text-text-tertiary'}`}
    >
      {len}/{max}
    </span>
  )
}

function FieldInput({
  label,
  value,
  onChange,
  maxChars,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  maxChars?: number
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-text-secondary text-[13px] font-normal">{label}</Label>
        {maxChars && <CharCount value={value} max={maxChars} />}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 text-[14px]"
      />
    </div>
  )
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-text-secondary text-[13px] font-normal">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-9 h-9 rounded-md border border-border-default cursor-pointer appearance-none bg-transparent p-0"
            style={{ colorScheme: 'light' }}
          />
        </div>
        <Input
          value={value}
          onChange={(e) => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
          }}
          className="h-9 text-[14px] font-mono uppercase"
          maxLength={7}
        />
      </div>
    </div>
  )
}

export default function WalletPassDesignerDetail() {
  const navigate = useNavigate()
  const [exportOpen, setExportOpen] = useState(false)
  const [platform, setPlatform] = useState<Platform>('apple')

  const [eventName, setEventName] = useState('Devcon 8')
  const [eventDate, setEventDate] = useState('November 12, 2026')
  const [eventTime, setEventTime] = useState('9:00 AM')
  const [venueName, setVenueName] = useState('Jio World Convention Centre')
  const [venueLocation, setVenueLocation] = useState('Mumbai, India')
  const [ticketHolder, setTicketHolder] = useState('John Doe')
  const [ticketType, setTicketType] = useState('General Admission')
  const [seatSection, setSeatSection] = useState('')
  const [seatRow, setSeatRow] = useState('')
  const [seatNumber, setSeatNumber] = useState('')

  const [backgroundColor, setBackgroundColor] = useState('#45326C')
  const [foregroundColor, setForegroundColor] = useState('#FFFFFF')
  const [labelColor, setLabelColor] = useState('#C8C8DC')
  const [logoUrl, setLogoUrl] = useState('')
  const [stripImageUrl, setStripImageUrl] = useState('')
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('QR')

  const handleLogoUpload = useCallback((dataUrl: string) => setLogoUrl(dataUrl), [])
  const handleStripUpload = useCallback((dataUrl: string) => setStripImageUrl(dataUrl), [])

  const state = {
    eventName,
    eventDate,
    eventTime,
    venueName,
    venueLocation,
    ticketHolder,
    ticketType,
    seatSection,
    seatRow,
    seatNumber,
    backgroundColor,
    foregroundColor,
    labelColor,
    barcodeType,
  }

  const exportJson = platform === 'apple' ? generateAppleJson(state) : generateGoogleJson(state)
  const exportFileName = platform === 'apple' ? 'pass.json' : 'event-ticket-class.json'

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2 text-text-secondary hover:text-text-primary gap-2 text-base"
          onClick={() => navigate('/experiments')}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Wallet Pass Designer
          </h1>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-base"
            onClick={() => setExportOpen(true)}
          >
            <Code size={16} strokeWidth={1.5} />
            Export
          </Button>
        </div>
        <p className="mt-3 text-text-secondary text-base font-light leading-relaxed max-w-2xl">
          Design and preview Apple Wallet and Google Wallet event ticket passes.
          Export a developer-ready spec with platform JSON and image requirements.
        </p>
      </header>

      {/* Platform Toggle */}
      <Tabs
        value={platform}
        onValueChange={(v) => setPlatform(v as Platform)}
      >
        <TabsList>
          <TabsTrigger value="apple">Apple Wallet</TabsTrigger>
          <TabsTrigger value="google">Google Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="apple" />
        <TabsContent value="google" />
      </Tabs>

      {/* Preview */}
      <div className="w-full rounded-xl border border-border overflow-hidden bg-[#f0efed] flex items-center justify-center py-10 px-4">
        <WalletPassPreview
          platform={platform}
          eventName={eventName}
          eventDate={eventDate}
          eventTime={eventTime}
          venueName={venueName}
          venueLocation={venueLocation}
          ticketHolder={ticketHolder}
          ticketType={ticketType}
          seatSection={seatSection}
          seatRow={seatRow}
          seatNumber={seatNumber}
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          labelColor={labelColor}
          logoUrl={logoUrl}
          stripImageUrl={stripImageUrl}
          barcodeType={barcodeType}
          onLogoUpload={handleLogoUpload}
          onStripImageUpload={handleStripUpload}
        />
      </div>

      {/* Controls — side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Fields */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-text-primary">Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldInput label="Event Name" value={eventName} onChange={setEventName} maxChars={24} placeholder="Devcon 8" />
            <FieldInput label="Ticket Type" value={ticketType} onChange={setTicketType} maxChars={20} placeholder="General Admission" />
            <FieldInput label="Event Date" value={eventDate} onChange={setEventDate} placeholder="November 12, 2026" />
            <FieldInput label="Event Time" value={eventTime} onChange={setEventTime} placeholder="9:00 AM" />
            <FieldInput label="Venue Name" value={venueName} onChange={setVenueName} maxChars={30} placeholder="Jio World Convention Centre" />
            <FieldInput label="Venue Location" value={venueLocation} onChange={setVenueLocation} placeholder="Mumbai, India" />
            <FieldInput label="Ticket Holder" value={ticketHolder} onChange={setTicketHolder} placeholder="John Doe" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FieldInput label="Section" value={seatSection} onChange={setSeatSection} placeholder="A" />
            <FieldInput label="Row" value={seatRow} onChange={setSeatRow} placeholder="12" />
            <FieldInput label="Seat" value={seatNumber} onChange={setSeatNumber} placeholder="5" />
          </div>
        </section>

        {/* Design Controls */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-text-primary">Design</h2>
          <div className="space-y-4">
            <ColorInput label="Background Color" value={backgroundColor} onChange={setBackgroundColor} />
            {platform === 'apple' && (
              <>
                <ColorInput label="Text Color" value={foregroundColor} onChange={setForegroundColor} />
                <ColorInput label="Label Color" value={labelColor} onChange={setLabelColor} />
              </>
            )}
            <div className="space-y-1.5">
              <Label className="text-text-secondary text-[13px] font-normal">Barcode Type</Label>
              <Select value={barcodeType} onValueChange={(v) => setBarcodeType(v as BarcodeType)}>
                <SelectTrigger className="h-9 text-[14px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QR">QR Code</SelectItem>
                  <SelectItem value="PDF417">PDF417</SelectItem>
                  <SelectItem value="Aztec">Aztec</SelectItem>
                  <SelectItem value="Code128">Code 128</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image upload hints */}
          <div className="text-[13px] text-text-tertiary font-light space-y-1 pt-2">
            <p>Drop images directly onto the pass preview above to set logo and {platform === 'apple' ? 'strip' : 'hero'} images.</p>
            {platform === 'apple' ? (
              <p>Logo: 160x50 @1x &middot; Strip: 375x98 @1x</p>
            ) : (
              <p>Logo: 660x660 (circle crop) &middot; Hero: 1032x336</p>
            )}
          </div>
        </section>
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        componentSource={exportJson}
        fileName={exportFileName}
        installCommand={IMAGE_SPECS}
        fontInstructions={
          platform === 'apple'
            ? 'Apple Wallet passes use the system font (San Francisco). No custom fonts are supported in pass.json. Use foregroundColor and labelColor to control text appearance.'
            : 'Google Wallet passes use Google Sans (Roboto fallback). Text color is automatically derived from the background color — light backgrounds get dark text, dark backgrounds get light text.'
        }
      />
    </div>
  )
}

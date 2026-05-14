export interface Speaker {
  id: string
  name: string
  title: string
  company: string
  color: string
  image: string
  type?: 'speaker' | 'logo'
  eventLogo?: string
  companyLogo?: string
}

export const speakers: Speaker[] = [
  { id: 'vitalik', name: 'Vitalik Buterin', title: 'Co-Founder', company: 'Ethereum', color: '#6366f1', image: '/speakers/vitalik-buterin.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/ethereum-foundation.png' },
  { id: 'audrey', name: 'Audrey Tang', title: 'Digital Minister', company: 'Taiwan', color: '#8b5cf6', image: '/speakers/audrey-tang.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png' },
  { id: 'danny', name: 'Danny Ryan', title: 'President', company: 'Etherealize', color: '#a855f7', image: '/speakers/danny-ryan.jpg', eventLogo: '/speakers/past-event-logos/devcon6-bogota.png', companyLogo: '/speakers/company-logos/Etherealize.png' },
  { id: 'aya', name: 'Aya Miyaguchi', title: 'Executive Director', company: 'Ethereum Foundation', color: '#d946ef', image: '/speakers/aya.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/ethereum-foundation.png' },
  { id: 'joseph', name: 'Joseph Lubin', title: 'Founder', company: 'ConsenSys', color: '#ec4899', image: '/speakers/joseph-lubin.jpg', eventLogo: '/speakers/past-event-logos/devcon5-osaka.png', companyLogo: '/speakers/company-logos/consensys.png' },
  { id: 'hsiao', name: 'Hsiao-Wei Wang', title: 'Researcher', company: 'Ethereum Foundation', color: '#f43f5e', image: '/speakers/hsiao-wei.jpg', eventLogo: '/speakers/past-event-logos/devcon6-bogota.png', companyLogo: '/speakers/company-logos/ethereum-foundation.png' },
  { id: 'justin', name: 'Justin Drake', title: 'Researcher', company: 'Ethereum Foundation', color: '#6366f1', image: '/speakers/justin-drake.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/ethereum-foundation.png' },
  { id: 'brewster', name: 'Brewster Kahle', title: 'Founder', company: 'Internet Archive', color: '#8b5cf6', image: '/speakers/brewster-kahle.jpg', eventLogo: '/speakers/past-event-logos/devcon6-bogota.png', companyLogo: '/speakers/company-logos/internet-archive.png' },
  { id: 'stani', name: 'Stani Kulechov', title: 'Founder & CEO', company: 'Aave', color: '#f97316', image: '/speakers/stani kulechov.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/aave.png' },
  { id: 'sreeram', name: 'Sreeram Kannan', title: 'Founder', company: 'EigenCloud', color: '#06b6d4', image: '/speakers/Sreeram Kannan.jpg', eventLogo: '/speakers/past-event-logos/devcon6-bogota.png', companyLogo: '/speakers/company-logos/eigencloud.png' },
  { id: 'pooja', name: 'Pooja Ranjan', title: 'Project Manager', company: 'Ethereum Cat Herders', color: '#14b8a6', image: '/speakers/pooja-ranjan.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/ethereum-cat-herders.png' },
  { id: 'jesse', name: 'Jesse Pollak', title: 'Creator', company: 'Base', color: '#2563eb', image: '/speakers/jesse-pollak.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/base.png' },
  { id: 'hart', name: 'Hart Montgomery', title: 'CTO', company: 'Linux Foundation', color: '#8b5cf6', image: '/speakers/hart-montgomery.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/linux-foundation.png' },
  { id: 'roger', name: 'Roger Dingledine', title: 'Co-Founder', company: 'Tor Project', color: '#d946ef', image: '/speakers/roger-dingledine.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/tor-project.png' },
  { id: 'david', name: 'David Hoffman', title: 'Co-Founder', company: 'Bankless', color: '#f97316', image: '/speakers/david-hoffman.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/bankless.png' },
  { id: 'bruno', name: 'Bruno Maçães', title: 'Author', company: 'Independent', color: '#22c55e', image: '/speakers/bruno-macaes.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png' },
  { id: 'tomasz', name: 'Tomasz Stańczak', title: 'Founder', company: 'Nethermind', color: '#06b6d4', image: '/speakers/tomasz.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/nethermind.png' },
  { id: 'puja', name: 'Puja Ohlhaver', title: 'Technologist', company: 'Independent', color: '#7c3aed', image: '/speakers/Puja Ohlhaver.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png' },
  { id: 'soham', name: 'Soham Sankaran', title: 'Founder', company: 'Pop Vax', color: '#22c55e', image: '/speakers/Soham Sankaran.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/popvax-india.png' },
  { id: 'sunny', name: 'Sunny Aggarwal', title: 'Co-Founder', company: 'Osmosis', color: '#059669', image: '/speakers/Sunny-Aggarwal.jpg', eventLogo: '/speakers/past-event-logos/devcon5-osaka.png', companyLogo: '/speakers/company-logos/osmosis.png' },
  { id: 'kurt', name: 'Kurt Opsahl', title: 'General Counsel', company: 'Filecoin Foundation', color: '#0891b2', image: '/speakers/kurt-opsahl.jpg', eventLogo: '/speakers/past-event-logos/devcon6-bogota.png', companyLogo: '/speakers/company-logos/filecoin foundation.png' },
  { id: 'mudit', name: 'Mudit Gupta', title: 'CISO', company: 'Polygon', color: '#e11d48', image: '/speakers/mudit-gupta.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/polygon.png' },
  { id: 'tarun', name: 'Tarun Chitra', title: 'Founder', company: 'Gauntlet', color: '#f97316', image: '/speakers/tarun-chitra.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/gauntlet.png' },
  { id: 'vinay', name: 'Vinay Gupta', title: 'Founder', company: 'Mattereum', color: '#6366f1', image: '/speakers/vinay-gupta.jpg', eventLogo: '/speakers/past-event-logos/devcon4-prague.png', companyLogo: '/speakers/company-logos/mattereum.png' },
  { id: 'aayush', name: 'Aayush Gupta', title: 'Founder', company: 'SettleX', color: '#2563eb', image: '/speakers/aayush-gupta.jpg', eventLogo: '/speakers/past-event-logos/devcon7-sea.png', companyLogo: '/speakers/company-logos/settlex.png' },
]

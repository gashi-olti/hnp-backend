import { HnpConfig } from '@ioc:Adonis/Addons/Hnp'

const hnpConfig: HnpConfig = {
  jobTypes: [
    { id: 1, name: 'Full Time' },
    { id: 2, name: 'Part Time' },
    { id: 3, name: 'Internship' },
  ],

  jobPositionTypes: [
    { id: 1, name: 'Administrator', category: 'Administration' },
    { id: 2, name: 'Recepsionist', category: 'Administration' },
    { id: 3, name: 'Asistent Administrativ', category: 'Administration' },
    { id: 4, name: 'Praktikë', category: 'Administration' },
    { id: 5, name: 'Software Engineer', category: 'IT' },
    { id: 6, name: 'FrontEnd Developer', category: 'IT' },
    { id: 7, name: 'BackEnd Developer', category: 'IT' },
  ],
  cities: [
    { id: 1, name: 'Të gjitha' },
    { id: 2, name: 'Prishtinë', country: 'XK' },
    { id: 3, name: 'Prizren', country: 'XK' },
    { id: 4, name: 'Pejë', country: 'XK' },
    { id: 5, name: 'Mitrovicë', country: 'XK' },
    { id: 6, name: 'Gjilan', country: 'XK' },
    { id: 7, name: 'Ferizaj', country: 'XK' },
    { id: 8, name: 'Gjakovë', country: 'XK' },
    { id: 9, name: 'Therandë', country: 'XK' },
    { id: 10, name: 'Fushë-Kosovë', country: 'XK' },
    { id: 11, name: 'Rahovec', country: 'XK' },
    { id: 12, name: 'Podujevë', country: 'XK' },
    { id: 13, name: 'Vushtri', country: 'XK' },
    { id: 14, name: 'Drenas', country: 'XK' },
    { id: 15, name: 'Lipjan', country: 'XK' },
    { id: 16, name: 'Istog', country: 'XK' },
    { id: 17, name: 'Në Kosovë', country: 'XK' },
    { id: 18, name: 'Në Shqipëri', country: 'AL' },
  ],
}

export default hnpConfig

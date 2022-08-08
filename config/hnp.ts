import { HnpConfig } from '@ioc:Adonis/Addons/Hnp'

const hnpConfig: HnpConfig = {
  jobTypes: [
    { id: 1, category: 'Full Time' },
    { id: 2, category: 'Part Time' },
    { id: 3, category: 'Internship' },
  ],

  jobPositionTypes: [
    {
      id: 1,
      category: 'Administration',
      job_position: [
        { name: 'Administrator' },
        { name: 'Recepsionist' },
        { name: 'Asistent Administrativ' },
        { name: 'Praktikë' },
      ],
    },
    {
      id: 2,
      category: 'IT',
      job_position: [
        { name: 'Software Engineer' },
        { name: 'FrontEnd Developer' },
        { name: 'BackEnd Developer' },
        { name: 'Full Stack Developer' },
      ],
    },
  ],

  locations: [
    {
      country_code: 'XK',
      country_name: 'Kosovë',
      cities: [
        { name: 'Prishtinë' },
        { name: 'Prizren' },
        { name: 'Pejë' },
        { name: 'Mitrovicë' },
        { name: 'Gjilan' },
        { name: 'Ferizaj' },
        { name: 'Gjakovë' },
        { name: 'Therandë' },
        { name: 'Fushë-Kosovë' },
        { name: 'Rahovec' },
        { name: 'Podujevë' },
        { name: 'Vushtri' },
        { name: 'Drenas' },
        { name: 'Lipjan' },
        { name: 'Istog' },
      ],
    },
    {
      country_code: 'AL',
      country_name: 'Shqipëri',
      cities: [
        { name: 'Tiranë' },
        { name: 'Vlorë' },
        { name: 'Durrës' },
        { name: 'Kukës' },
        { name: 'Shkodër' },
      ],
    },
  ],
}

export default hnpConfig

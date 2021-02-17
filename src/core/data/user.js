export const userModel = {
  mentor: '',
  local: { email: '' },
  picture: { link: '' },
  identity: {
    nationality: '',
    birthDate: '',
    birthCountry: '',
    birthState: '',
    birthCity: '',
    socialSecurityNumber: '',
  },
  contact: {
    address: { fullAddress: '' },
  },
  role: { client: { _id: '' } },
  administrative: {
    emergencyContact: { name: '', phoneNumber: '' },
    identityDocs: '',
    idCardRecto: {},
    idCardVerso: {},
    healthAttest: {},
    passport: {},
    residencePermitRecto: {},
    residencePermitVerso: {},
    mutualFund: { has: null },
    certificates: [],
    medicalCertificate: {},
    phoneInvoice: {},
    transportInvoice: { type: '' },
    payment: {
      rib: { iban: '', bic: '' },
    },
  },
  establishment: null,
  company: {
    address: { fullAddress: '' },
  },
};

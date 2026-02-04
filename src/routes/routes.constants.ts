export const ROUTES = {
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  DASHBOARD: {
    BASE: '/',
  },
  ANIMALS: {
    BASE: '/animals',
    ATTACHMENTS: '/animals/:animalUuid/attachments',
    MEDICINE_APPLICATIONS: '/animals/:animalUuid/medicine-applications',
  },
  MEDICINES: {
    BASE: '/medicines',
  },
  MEDICINE_BRANDS: {
    BASE: '/medicine-brands',
  },
} as const;

export const getAnimalAttachmentsPath = (animalUuid: string) => `/animals/${animalUuid}/attachments`;
export const getAnimalMedicineApplicationsPath = (animalUuid: string) => `/animals/${animalUuid}/medicine-applications`;

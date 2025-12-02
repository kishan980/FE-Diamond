import * as yup from 'yup';

const websiteRegex = /^(https?:\/\/)?([\w\\-]+\.)+[a-z]{2,6}(:\d{1,5})?(\/\S*)?$/i;

export const eventValidationSchema = yup.object({
  refcomapnyIdComapanyInfo: yup.number().required('Platform display is required'),
  eventType: yup.string().required('Event type is required'),
  refEventCategoryIdEventCategoryMas: yup.string().required('Product type is required'),
  refSellerIdEntityMas: yup.string().required('Event organised For is required'),
  pageSize: yup.number().required('Page size is required').min(10, 'Minimum page size is 10').max(100, 'Maximum page size is 100'),
  refTermsConditionsMstSeqNo: yup.string().required('Select terms & conditions is required'),
  isTermsncondition: yup.string().required('Terms & conditions popup is required'),
  startDateTime: yup.date().required('Event start date&time is required'),
  endDateTime: yup.date().required('Tender start date&time is required'),
  auctionStartDate: yup
    .date()
    .nullable()
    .when('eventType', {
      is: (val: unknown) => Number(val) === 2,
      then: (schema) => schema.required('Auction start date is required'),
      otherwise: (schema) => schema.nullable(),
    }),
  eventDescription: yup.string().required('Brief event description is required'),
});

// Revised Terms & Conditions Validation
export const revisedTermsAndConditionsSchema = yup.object({
  termsConditionDoc: yup.mixed().required('Terms & conditions and instructions is required'),
});

// Selling Company Validation
export const sellingCompanySchema = yup.object({
  companyName: yup.string().required('Company Name is required'),
  website: yup
    .string()
    .notRequired()
    .trim()
    .test('is-valid-website', 'Invalid website address', (value) => {
      if (!value) return true;
      return websiteRegex.test(value);
    }),
});

// Terms & Conditions Validation
export const termsAndConditionsSchema = yup.object({
  title: yup.string().required('Title is required'),
  termsConditionDoc: yup.mixed().required('Terms & conditions and instructions is required'),
});

// Legal Document Validation
export const legalDocumentSchema = yup.object({
  title: yup.string().required('Document title is required'),
  eventCategoryId: yup.string().required('Event type is required'),
  docDescription: yup.string().required('Document Description is required'),
});

export const emailTemplateSchema = yup.object({
  emailSubject: yup.string().required('Email subject is required'),
  emailBody: yup.string().required('Email body is required'),
});

export const homePageDisplaySchema = yup.object({
  refcomapnyIdComapanyInfo: yup.number().required('Platform display is required'),
  companyName: yup.string().required('Company name is required'),
  address: yup.string().required('Address is required'),
  countryCode: yup.string().required('Country Code is required'),
  helpDesk: yup
    .string()
    .matches(/^\d+$/, 'Help desk number must be numeric')
    .required('Help desk number is required')
    .min(10, 'Help desk number must be 10 digits')
    .max(15, 'Help desk number must not exceed 15 characters'),
  telephoneCountryCode: yup.string().required('Country Code is required'),
  telephoneNumber: yup
    .string()
    .matches(/^\d+$/, 'Telephone number must be numeric')
    .required('Telephone number is required')
    .min(10, 'Telephone number must be 10 digits')
    .max(15, 'Telephone number must not exceed 15 characters'),
  faxCountry: yup.string().required('Country Code is required'),
  faxNumber: yup
    .string()
    .matches(/^\d+$/, 'Fax number must be numeric')
    .required('Fax number is required')
    .min(10, 'Fax number must be 10 digits')
    .max(15, 'Fax number must not exceed 15 characters'),
  email: yup.string().required('Email address is required'),
});

export const administratorSchema = (administratorsId: number, isDownloadAccess: boolean) =>
  yup.object({
    username: yup.string().when([], {
      is: () => !administratorsId,
      then: (schema) => schema.required('Username is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    password: yup.string().when([], {
      is: () => !administratorsId,
      then: (schema) =>
        schema
          .required('Password is required')
          .min(8, 'Password must be at least 8 characters long')
          .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
          .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
          .matches(/\d/, 'Password must contain at least one digit')
          .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
      otherwise: (schema) => schema.notRequired(),
    }),
    confirmpassword: yup.string().when('password', {
      is: (val: string) => !administratorsId && Boolean(val),
      then: (schema) =>
        schema.oneOf([yup.ref('password'), ''], 'Password and Confirm Password do not match').required('Confirm password is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    contactPerson: yup.string().required('Contact person is required'),
    email: yup.string().required('Email address is required'),
    countryCode: yup.string().required('Country code is required'),
    phoneNumber: yup
      .string()
      .matches(/^\d+$/, 'Mobile number must be numeric')
      .required('Mobile number is required')
      .min(10, 'Mobile number must be 10 digits')
      .max(15, 'Mobile number must not exceed 15 characters'),
    archive: yup.boolean(),
    parameters: yup.boolean(),
    downloadFiles: yup.boolean(),
    accessPassword: yup.boolean().test('At-least-one-checked', 'At least one checkbox must be checked', function () {
      if (isDownloadAccess) return true;
      const { archive, parameters, downloadFiles, accessPassword } = this.parent;
      return archive || parameters || downloadFiles || accessPassword;
    }),
  });

export const polishedBidderSchema = (polishedBiddersId: number, isPassword: boolean) =>
  yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().when([], {
      is: () => (!polishedBiddersId && !isPassword) || isPassword,
      then: (schema) =>
        schema
          .required('Password is required')
          .min(8, 'Password must be at least 8 characters long')
          .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
          .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
          .matches(/\d/, 'Password must contain at least one digit')
          .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
      otherwise: (schema) => schema.strip(),
    }),
    confirmpassword: yup.string().when(['password'], {
      is: (val: string) => ((!polishedBiddersId && !isPassword) || isPassword) && Boolean(val),
      then: (schema) => schema.required('Confirm password is required').oneOf([yup.ref('password')], 'Passwords not match'),
      otherwise: (schema) => schema.strip(),
    }),
    contactPerson: yup
      .string()
      .matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed')
      .required('Contact Person is required'),
    contactPerson1: yup.string().matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed'),
    mobileNumber: yup
      .string()
      .matches(/^\d+$/, 'Mobile number must be numeric')
      .required('Mobile number is required')
      .min(10, 'Mobile number must be 10 digits')
      .max(15, 'Mobile number must not exceed 15 characters'),
    email: yup.string().required('Email is required'),
    telCountry: yup.string().required('Country code is required'),
    telephoneNumber: yup
      .string()
      .required('Telephone number is required')
      .matches(/^\d+$/, 'Telephone number must be numeric')
      .required('Telephone number is required')
      .min(10, 'Telephone number must be 10 digits')
      .max(15, 'Telephone number must not exceed 15 characters'),
    companyName: yup.string().required('Company name is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    country: yup.string().required('Country is required'),
    isActive: polishedBiddersId ? yup.number().required('Is required') : yup.number(),
    countryCode: yup.string().required('Country code is required'),
  });

export const roughBidderSchema = (roughBiddersId: number, isPassword: boolean) =>
  yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().when([], {
      is: () => (!roughBiddersId && !isPassword) || isPassword,
      then: (schema) =>
        schema
          .required('Password is required')
          .min(8, 'Password must be at least 8 characters long')
          .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
          .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
          .matches(/\d/, 'Password must contain at least one digit')
          .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
      otherwise: (schema) => schema.strip(),
    }),
    confirmpassword: yup.string().when(['password'], {
      is: (val: string) => ((!roughBiddersId && !isPassword) || isPassword) && Boolean(val),
      then: (schema) => schema.required('Confirm password is required').oneOf([yup.ref('password')], 'Passwords not match'),
      otherwise: (schema) => schema.strip(),
    }),
    contactPerson: yup
      .string()
      .matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed')
      .required('Contact Person is required'),
    contactPerson1: yup.string().matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed'),
    mobileNumber: yup
      .string()
      .matches(/^\d+$/, 'Mobile number must be numeric')
      .required('Mobile number is required')
      .min(10, 'Mobile number must be 10 digits')
      .max(15, 'Mobile number must not exceed 15 characters'),
    email: yup.string().required('Email is required'),
    telCountry: yup.string().required('Country code is required'),
    telephoneNumber: yup
      .string()
      .matches(/^\d+$/, 'Telephone number must be numeric')
      .required('Telephone number is required')
      .min(10, 'Telephone number must be 10 digits')
      .max(15, 'Telephone number must not exceed 15 characters'),
    companyName: yup.string().required('Company name is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    country: yup.string().required('Country is required'),
    isActive: roughBiddersId ? yup.number().required('Status is required') : yup.number(),
    countryCode: yup
      .string()
      .required('Country Code is required')
      .matches(/^\+\d+$/, 'Country code must contain only digits'),
  });

export const viewerSchema = (viewersId: number, isPassword: boolean) =>
  yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().when([], {
      is: () => !isPassword,
      then: (schema) =>
        schema
          .required('Password is required')
          .min(8, 'Password must be at least 8 characters long')
          .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
          .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
          .matches(/\d/, 'Password must contain at least one digit')
          .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
      otherwise: (schema) => schema.strip(),
    }),
    confirmpassword: yup.string().when('password', {
      is: (val: string) => !isPassword && Boolean(val),
      then: (schema) =>
        viewersId
          ? schema.oneOf([yup.ref('password'), ''], 'Password and Confirm Password do not match').required('Confirm password is required')
          : schema.required('Confirm password is required').oneOf([yup.ref('password'), ''], 'Password and Confirm Password do not match'),
      otherwise: (schema) => schema.strip(),
    }),
    contactPerson: yup
      .string()
      .matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed')
      .required('Contact person is required'),
    email: yup.string().required('Email address is required'),
    mobCountryCode: yup.string().required('Mobile Code is required'),
    mobileNumber: yup
      .string()
      .matches(/^\d+$/, 'Mobile number must be numeric')
      .required('Mobile number is required')
      .min(10, 'Mobile number must be 10 digits')
      .max(15, 'Mobile number must not exceed 15 characters'),
    companyName: yup.string().required('Company name is required'),
    address: yup.string().required('Address  is required'),
    city: yup.string().required('City is required'),
    country: yup.string().required('Country is required'),
    telCountry: yup.string().required('Telephone code No is required'),
    telephoneNumber: yup
      .string()
      .matches(/^\d+$/, 'Telephone number must be numeric')
      .required('Telephone number is required')
      .min(10, 'Telephone number must be 10 digits')
      .max(15, 'Telephone number must not exceed 15 characters'),
  });

export const customisedReportSchema = yup.object({
  tenderCategory: yup.string().required('Tender Category is required'),
  reportName: yup.string().required('Report Name is required'),
  reportDescription: yup.string().required('Report Description is required'),
  archivesFromDate: yup.date().required('From date&time is required'),
  archivesToDate: yup.date().required('To date&time is required'),
  sellingCompany: yup.string().required('Selling Company is required'),
  selectedColumns: yup.string().required('Selected Columns is required'),
});

export const profileDetailSchema = yup.object({
  companyName: yup.string().required('Company name is required'),
  address: yup.string().required('Address line 1 is required'),
  city: yup.string().required('City is required'),
  telephoneNumber: yup.string().required('Telephone number is required'),
  telCountry: yup.string().required('Country code is required'),
  faxCountry1: yup.string().required('Country code is required'),
  countryCode: yup.string().required('Country code is required'),
  countryCode1: yup.string().required('Country code is required'),
  contactPerson: yup.string().required('Contact person is required'),
  email: yup.string().required('Email is required'),
  mobileNumber: yup
    .string()
    .matches(/^\d+$/, 'Mobile number must be numeric')
    .required('Mobile number is required')
    .min(10, 'Mobile number must be 10 digits')
    .max(15, 'Mobile number must not exceed 15 characters'),
});

export const emailInvitationSchema = yup.object({
  emailSubject: yup.string().required('Email subject is required'),
});

export const myProfileSchema = yup.object({
  companyName: yup.string().required('Company name is required'),
  address: yup.string().required('Address line 1 is required'),
  city: yup.string().required('City is required'),
  telephoneNumber: yup.string().required('Telephone number is required'),
  countryCode: yup.string().required('Country code is required'),
  contactPerson: yup.string().required('Contact person is required'),
  email: yup.string().required('Email is required'),
  mobileNumber: yup
    .string()
    .matches(/^\d+$/, 'Mobile number must be numeric')
    .required('Mobile number is required')
    .min(10, 'Mobile number must be 10 digits')
    .max(15, 'Mobile number must not exceed 15 characters'),
});

export const updatePasswordDialogSchema = yup.object({
  password: yup.string().required('Password is required'),
  newPassword: yup.string().required('New Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'New Password and Confirm Password do not match')
    .required('Confirm Password is required'),
});

export const loginDialogSchema = yup.object({
  password: yup.string().required('Password is required'),
});

export const roughUploadLotSchema = yup.object().shape({
  stockNo: yup.string().required('Lot No is required'),
  Size: yup.string().required('Size is required'),
  stockDesc: yup.string().required('Stock Description is required'),
  SellerID: yup.number().required('Seller ID is required'),
  MineID: yup.number().required('Mine ID is required'),
  pcs: yup.number().typeError('PCS must be a number').required('PCS is required').min(1, 'PCS must be a positive number'),
  cts: yup
    .number()
    .typeError('CTS must be a number')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  rate: yup
    .number()
    .typeError('Rate must be a number')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  refEventTypeID_EventTypeMas: yup.number().required('Sales type is required'),
});

export const polishedUploadLotSchema = yup.object().shape({
  stockNo: yup.string().required('Lot No is required'),
  Clarity: yup.string().required('Clarity is required'),
  Colour: yup.string().required('Colour is required'),
  Shape: yup.string().required('Shape is required'),
  cts: yup
    .number()
    .typeError('CTS must be a number')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  Cut: yup.string().required('Cut is required'),
  pcs: yup.number().typeError('PCS must be a number').required('PCS is required').min(1, 'PCS must be a positive number'),
  Comment: yup.string().required('Comment is required').max(30, 'Comment must be at most 30 characters'),
  refEventTypeID_EventTypeMas: yup.number().required('Sales type is required'),
});

const thingEntity = {
  title: {
    createThing: 'Create Thing',
    updateThing: 'Update Thing',
    thingDetails: 'Thing Details'
  },
  thing: 'Thing',
  label: {
    confirmThingInfo: 'Confirm Thing Info',
    address: 'Address',
    locationName: 'Name',
    locationPicker: 'Location Picker',
    longitude: 'Longitude',
    latitude: 'Latitude',
    ThingInfo: 'Thing Info',
    devices: 'Devices'
  },
  textContent: {
    confirmCreateAccount:
      'This email is not linked to any existing account. Would you like to register an account with this email address?'
  },
  downloadCertificatesThingNotFound:
    'Only Thing Owners have the permission to download Certificates and Keys',
  placeholder: {
    search: 'Search by Thing, Location, Owner'
  },
  button: {
    ThingMap: 'Thing Map',
    createThing: 'Create Thing',
    updateThing: 'Update Thing',
    deleteThing: 'Delete Thing',
    map: 'Map',
    addOwner: 'Add Owner',
    ownerAssignment: 'Owner Assignment',
    downloadNewCertAndKeys: 'Download new certificates and keys',
    downloadCertAndKeys: 'Download certificates and keys',
    download: 'Download',
    downloaded: 'Downloaded',
    downloadFiles: 'Download Files',
  },
  devices: {
    name: 'Name',
    model: 'Model',
    defaultParameter: 'Default Parameter'
  },
  downloadCertAndKeysModal: {
    description:
      'Download and install the certificate and key files to your device so that it can connect security to AWS IoT.',
    deviceCert: 'Device certificate',
    keyFiles: 'Key files',
    keyFilesDESC: 'The key files are unique to this certificate.',
    publicKeyFile: 'Public key file',
    privateKeyFile: 'Private key file',
    rootCA: 'Root CA certificates',
    rootCADesc:
      'Download the root CA certificate file that corresponds to the type of data endpoint and cipher suite you’re using.',
    amazonServices: 'Amazon trust services endpoint',
    supplementaryFile: 'Supplementary file',
    howToConnectToIoTCoreFromEMS: 'How to connect to IoT Core from EMS'
  },
};

export default thingEntity;

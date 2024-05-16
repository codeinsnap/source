export interface AppEnvTypes {
  NEXT_PUBLIC_BASE_URL_API: string,
  NEXT_PUBLIC_REACT_APP_MS_AD_CLIENT_ID: string,
  NEXT_PUBLIC_REACT_APP_MS_AD_AUTH_URL: string,
  NEXT_PUBLIC_REACT_APP_DASHBOARD_URL: string,
  NEXT_PUBLIC_REACT_APP_ENV: string
};

const config: any = {
  'localhost': {
    NEXT_PUBLIC_BASE_URL_API: "https://eqa2p820oe.execute-api.us-west-2.amazonaws.com/dev",
    NEXT_PUBLIC_REACT_APP_MS_AD_CLIENT_ID: 'ff677218-c56b-438c-8b0d-1b798c1e8536',
    NEXT_PUBLIC_REACT_APP_MS_AD_AUTH_URL: "https://login.microsoftonline.com/9107b728-2166-4e5d-8d13-d1ffdf0351ef",
    NEXT_PUBLIC_REACT_APP_DASHBOARD_URL: '/Dashboard',
    NEXT_PUBLIC_REACT_APP_ENV: 'LOCAL'
  },
  'one.tlslodev.toyota.com': {
    NEXT_PUBLIC_BASE_URL_API: 'https://eqa2p820oe.execute-api.us-west-2.amazonaws.com/dev',
    NEXT_PUBLIC_REACT_APP_MS_AD_CLIENT_ID: 'ff677218-c56b-438c-8b0d-1b798c1e8536',
    NEXT_PUBLIC_REACT_APP_MS_AD_AUTH_URL: 'https://login.microsoftonline.com/9107b728-2166-4e5d-8d13-d1ffdf0351ef',
    NEXT_PUBLIC_REACT_APP_DASHBOARD_URL: '/DashBoard',
    NEXT_PUBLIC_REACT_APP_ENV: 'DEV'
  },
  'one.tlsloqa.toyota.com': {
    NEXT_PUBLIC_BASE_URL_API: 'https://yd2sj7uu81.execute-api.us-west-2.amazonaws.com/qa',
    NEXT_PUBLIC_REACT_APP_MS_AD_CLIENT_ID: '24d377f1-a8b9-4336-b568-58543aa36740',
    NEXT_PUBLIC_REACT_APP_MS_AD_AUTH_URL: 'https://login.microsoftonline.com/9107b728-2166-4e5d-8d13-d1ffdf0351ef',
    NEXT_PUBLIC_REACT_APP_DASHBOARD_URL: '/DashBoard',
    NEXT_PUBLIC_REACT_APP_ENV: 'QA'
  },
  'one.tlslouat.toyota.com': {
    NEXT_PUBLIC_BASE_URL_API: 'https://wyoahs1mv3.execute-api.us-west-2.amazonaws.com/uat',
    NEXT_PUBLIC_REACT_APP_MS_AD_CLIENT_ID: 'f36027f4-1c52-4506-abb2-dc2a57a8b6aa',
    NEXT_PUBLIC_REACT_APP_MS_AD_AUTH_URL: 'https://login.microsoftonline.com/9107b728-2166-4e5d-8d13-d1ffdf0351ef',
    NEXT_PUBLIC_REACT_APP_DASHBOARD_URL: '/DashBoard',
    NEXT_PUBLIC_REACT_APP_ENV: 'UAT'
  },
  'one.tlslo.toyota.com': {
    NEXT_PUBLIC_BASE_URL_API: 'https://91em8vv36m.execute-api.us-east-1.amazonaws.com/prod',
    NEXT_PUBLIC_REACT_APP_MS_AD_CLIENT_ID: 'd6c70757-643f-4887-8b71-aaa68fab8e87',
    NEXT_PUBLIC_REACT_APP_MS_AD_AUTH_URL: 'https://login.microsoftonline.com/8c642d1d-d709-47b0-ab10-080af10798fb',
    NEXT_PUBLIC_REACT_APP_DASHBOARD_URL: '/DashBoard',
    NEXT_PUBLIC_REACT_APP_ENV: 'PROD'
  }
}
let environment: AppEnvTypes = {} as any;
function applyConfig(): any {
  environment = config[window.location.hostname];
}

export { environment, applyConfig };
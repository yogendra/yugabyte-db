// Copyright (c) YugaByte, Inc.

import axios from 'axios';
import { IN_DEVELOPMENT_MODE, ROOT_URL, USE_SSO } from '../config';
import Cookies from 'js-cookie';
import { getCustomerEndpoint } from './common';

// Get current user(me) from token in localStorage
export const VALIDATE_FROM_TOKEN = 'VALIDATE_FROM_TOKEN';
export const VALIDATE_FROM_TOKEN_RESPONSE = 'VALIDATE_FROM_TOKEN_RESPONSE';

// Sign Up Customer
export const REGISTER = 'REGISTER';
export const REGISTER_RESPONSE = 'REGISTER_RESPONSE';

// Validate Customer registration
export const FETCH_PASSWORD_POLICY = 'FETCH_PASSWORD_POLICY';
export const FETCH_PASSWORD_POLICY_RESPONSE = 'FETCH_PASSWORD_POLICY_RESPONSE';

// Sign In Customer
export const LOGIN = 'LOGIN';
export const LOGIN_RESPONSE = 'LOGIN_RESPONSE';
export const INSECURE_LOGIN = 'INSECURE_LOGIN';
export const INSECURE_LOGIN_RESPONSE = 'INSECURE_LOGIN_RESPONSE';

export const RESET_CUSTOMER = 'RESET_CUSTOMER';

export const API_TOKEN_LOADING = 'API_TOKEN_LOADING';
export const API_TOKEN = 'API_TOKEN';
export const API_TOKEN_RESPONSE = 'API_TOKEN_RESPONSE';

// log out Customer
export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

// Update Customer Profile
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

// Update User Profile
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS';
export const UPDATE_USER_PROFILE_FAILURE = 'UPDATE_USER_PROFILE_FAILURE';

// Fetch User
export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

// Fetch Software Versions for Customer
export const FETCH_SOFTWARE_VERSIONS = 'FETCH_SOFTWARE_VERSIONS';
export const FETCH_SOFTWARE_VERSIONS_SUCCESS = 'FETCH_SOFTWARE_VERSIONS_SUCCESS';
export const FETCH_SOFTWARE_VERSIONS_FAILURE = 'FETCH_SOFTWARE_VERSIONS_FAILURE';

export const FETCH_HOST_INFO = 'FETCH_HOST_INFO';
export const FETCH_HOST_INFO_SUCCESS = 'FETCH_HOST_INFO_SUCCESS';
export const FETCH_HOST_INFO_FAILURE = 'FETCH_HOST_INFO_FAILURE';

export const FETCH_CUSTOMER_COUNT = 'FETCH_CUSTOMER_COUNT';

export const GET_ALERTS = 'GET_ALERTS';
export const GET_ALERTS_SUCCESS = 'GET_ALERTS_SUCCESS';
export const GET_ALERTS_FAILURE = 'GET_ALERTS_FAILURE';

export const CREATE_ALERT_CHANNEL = 'CREATE_ALERT_CHANNEL';
export const CREATE_ALERT_CHANNEL_RESPONSE = 'CREATE_ALERT_CHANNEL_RESPONSE';
export const UPDATE_ALERT_CHANNEL = 'UPDATE_ALERT_CHANNEL';
export const DELETE_ALERT_CHANNEL = 'DELETE_ALERT_CHANNEL';

export const CREATE_ALERT_DESTINATION = 'CREATE_ALERT_DESTINATION';
export const CREATE_ALERT_DESTINATION_RESPONSE = 'CREATE_ALERT_DESTINATION_RESPONSE';

export const CREATE_ALERT_CONFIG = 'CREATE_ALERT_CONFIG';
export const CREATE_ALERT_CONFIG_RESPONSE = 'CREATE_ALERT_CONFIG_RESPONSE';

export const UPDATE_ALERT_CONFIG = 'UPDATE_ALERT_CONFIG';
export const UPDATE_ALERT_CONFIG_RESPONSE = 'UPDATE_ALERT_CONFIG_RESPONSE';

export const UPDATE_ALERT_DESTINATION = 'UPDATE_ALERT_DESTINATION';
export const UPDATE_ALERT_DESTINATION_RESPONSE = 'UPDATE_ALERT_DESTINATION_RESPONSE';

export const DELETE_ALERT_DESTINATION = 'DELETE_ALERT_DESTINATION';
export const DELETE_ALERT_CONFIG = 'DELETE_ALERT_CONFIG';

export const GET_ALERT_CHANNELS = 'GET_ALERT_CHANNELS';
export const GET_ALERT_CHANNELS_SUCCESS = 'GET_ALERT_CHANNELS_SUCCESS';
export const GET_ALERT_CHANNELS_FAILURE = 'GET_ALERT_CHANNELS_FAILURE';

export const GET_ALERT_CONFIGS = 'GET_ALERT_CONFIGS';
export const GET_ALERT_DESTINATIONS = 'GET_ALERT_DESTINATIONS';
export const GET_ALERT_TEMPLATES = 'GET_ALERT_TEMPLATES';

export const FETCH_YUGAWARE_VERSION = 'FETCH_YUGAWARE_VERSION';
export const FETCH_YUGAWARE_VERSION_RESPONSE = 'FETCH_YUGAWARE_VERSION_RESPONSE';

export const ADD_CUSTOMER_CONFIG = 'ADD_CUSTOMER_CONFIG';
export const ADD_CUSTOMER_CONFIG_RESPONSE = 'ADD_CUSTOMER_CONFIG_RESPONSE';

export const SET_INITIAL_VALUES = 'SET_INITIAL_VALUES';

export const EDIT_CUSTOMER_CONFIG = 'EDIT_CUSTOMER_CONFIG';
export const EDIT_CUSTOMER_CONFIG_RESPONSE = 'EDIT_CUSTOMER_CONFIG_RESPONSE';

export const DELETE_CUSTOMER_CONFIG = 'DELETE_CUSTOMER_CONFIG';
export const DELETE_CUSTOMER_CONFIG_RESPONSE = 'DELETE_CUSTOMER_CONFIG_RESPONSE';

export const FETCH_CUSTOMER_CONFIGS = 'FETCH_CUSTOMER_CONFIGS';
export const FETCH_CUSTOMER_CONFIGS_RESPONSE = 'FETCH_CUSTOMER_CONFIGS_RESPONSE';

export const INVALID_CUSTOMER_TOKEN = 'INVALID_CUSTOMER_TOKEN';
export const RESET_TOKEN_ERROR = 'RESET_TOKEN_ERROR';

export const GET_LOGS = 'GET_LOGS';
export const GET_LOGS_SUCCESS = 'GET_LOGS_SUCCESS';
export const GET_LOGS_FAILURE = 'GET_LOGS_FAILURE';

export const GET_RELEASES = 'GET_RELEASES';
export const GET_RELEASES_RESPONSE = 'GET_RELEASES_RESPONSE';

export const FETCH_TLS_CERTS = 'FETCH_TLS_CERTS';
export const FETCH_TLS_CERTS_RESPONSE = 'FETCH_TLS_CERTS_RESPONSE';
export const ADD_TLS_CERT_RESET = 'ADD_TLS_CERT_RESET';

export const ADD_TLS_CERT = 'ADD_TLS_CERT';
export const ADD_TLS_CERT_RESPONSE = 'ADD_TLS_CERT_RESPONSE';

export const FETCH_CLIENT_CERT = 'FETCH_CLIENT_CERT';

export const REFRESH_RELEASES = 'REFRESH_RELEASES';
export const REFRESH_RELEASES_RESPONSE = 'REFRESH_RELEASES_RESPONSE';

export const IMPORT_RELEASE = 'IMPORT_RELEASE';
export const IMPORT_RELEASE_RESPONSE = 'IMPORT_RELEASE_RESPONSE';

export const UPDATE_RELEASE = 'UPDATE_RELEASE';
export const UPDATE_RELEASE_RESPONSE = 'UPDATE_RELEASE_RESPONSE';

export const GET_CUSTOMER_USERS = 'GET_CUSTOMER_USERS';
export const GET_CUSTOMER_USERS_SUCCESS = 'GET_CUSTOMER_USERS_SUCCESS';
export const GET_CUSTOMER_USERS_FAILURE = 'GET_CUSTOMER_USERS_FAILURE';

export const GET_SCHEDULES = 'GET_SCHEDULES';
export const GET_SCHEDULES_RESPONSE = 'GET_SCHEDULES_RESPONSE';
export const DELETE_SCHEDULE = 'DELETE_SCHEDULE';
export const DELETE_SCHEDULE_RESPONSE = 'DELETE_SCHEDULE_RESPONSE';

export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const DELETE_USER = 'DELETE_USER';
export const DELETE_USER_RESPONSE = 'DELETE_USER_RESPONSE';

export const CHANGE_USER_ROLE = 'CHANGE_USER_ROLE';

export const UPDATE_TLS = 'UPDATE_TLS';

export function validateToken() {
  let cUUID = Cookies.get('customerId');
  if (cUUID) {
    localStorage.setItem('customerId', cUUID);
  } else {
    cUUID = localStorage.getItem('customerId');
  }

  // in single sign-on mode authentication happens via PLAY_SESSION cookie and not via headers
  if (!USE_SSO) {
    axios.defaults.headers.common['X-AUTH-TOKEN'] =
      Cookies.get('authToken') || localStorage.getItem('authToken');
  }
  const apiToken = Cookies.get('apiToken') || localStorage.getItem('apiToken');
  if (apiToken && apiToken !== '') {
    axios.defaults.headers.common['X-AUTH-YW-API-TOKEN'] = apiToken;
  }

  // in dev mode UI and API usually run on different hosts, so need to include cookies for cross-domain requests
  if (IN_DEVELOPMENT_MODE) {
    axios.defaults.withCredentials = true;
  }
  if (!IN_DEVELOPMENT_MODE || !process.env.REACT_APP_YUGAWARE_API_URL) {
    axios.defaults.headers.common['Csrf-Token'] = Cookies.get('csrfCookie');
  }

  const request = axios(`${ROOT_URL}/customers/${cUUID}`);
  return {
    type: VALIDATE_FROM_TOKEN,
    payload: request
  };
}

export function validateFromTokenResponse(response) {
  return {
    type: VALIDATE_FROM_TOKEN_RESPONSE,
    payload: response
  };
}

export function register(formValues) {
  const request = axios.post(`${ROOT_URL}/register`, formValues);
  return {
    type: REGISTER,
    payload: request
  };
}

export function registerResponse(response) {
  return {
    type: REGISTER_RESPONSE,
    payload: response
  };
}

export function fetchPasswordPolicy() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/password_policy`);
  return {
    type: FETCH_PASSWORD_POLICY,
    payload: request
  };
}

export function fetchPasswordPolicyResponse(response) {
  return {
    type: FETCH_PASSWORD_POLICY_RESPONSE,
    payload: response
  };
}

export function login(formValues) {
  const request = axios.post(`${ROOT_URL}/login`, formValues);
  return {
    type: LOGIN,
    payload: request
  };
}

export function loginResponse(response) {
  return {
    type: LOGIN_RESPONSE,
    payload: response
  };
}

export function insecureLogin() {
  const request = axios.get(`${ROOT_URL}/insecure_login`);
  return {
    type: INSECURE_LOGIN,
    payload: request
  };
}

export function insecureLoginResponse(response) {
  return {
    type: INSECURE_LOGIN_RESPONSE,
    payload: response.payload
  };
}

export function logout() {
  const url = USE_SSO ? `${ROOT_URL}/third_party_logout` : `${ROOT_URL}/logout`;
  const request = axios.get(url);
  return {
    type: LOGOUT,
    payload: request
  };
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  };
}

export function logoutFailure(error) {
  return {
    type: LOGOUT_FAILURE,
    payload: error
  };
}

export function getApiTokenLoading() {
  return {
    type: API_TOKEN_LOADING
  };
}

export function getApiToken(authToken) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.put(`${ROOT_URL}/customers/${cUUID}/api_token`, {}, authToken);
  return {
    type: API_TOKEN,
    payload: request
  };
}

export function getApiTokenResponse(response) {
  return {
    type: API_TOKEN_RESPONSE,
    payload: response
  };
}

export function resetCustomer() {
  return {
    type: RESET_CUSTOMER
  };
}

export function customerTokenError() {
  return {
    type: INVALID_CUSTOMER_TOKEN
  };
}

export function resetCustomerError() {
  return {
    type: RESET_TOKEN_ERROR
  };
}

export function updateProfile(values) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.put(`${ROOT_URL}/customers/${cUUID}`, values);
  return {
    type: UPDATE_PROFILE,
    payload: request
  };
}

export function updateProfileSuccess(response) {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    payload: response
  };
}

export function updateProfileFailure(error) {
  return {
    type: UPDATE_PROFILE_FAILURE,
    payload: error
  };
}

export function updatePassword(user, values) {
  const cUUID = localStorage.getItem('customerId');
  const userUUID = user.uuid;
  const data = {
    ...values,
    role: user.role
  };
  const request = axios.put(
    `${ROOT_URL}/customers/${cUUID}/users/${userUUID}/change_password`,
    data
  );
  return {
    type: UPDATE_PROFILE,
    payload: request
  };
}

export function updatePasswordSuccess(response) {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    payload: response
  };
}

export function updatePasswordFailure(error) {
  return {
    type: UPDATE_PROFILE_FAILURE,
    payload: error
  };
}

export function updateUserProfile(user, values) {
  const cUUID = localStorage.getItem('customerId');
  const userUUID = user.uuid;
  const data = {
    ...values,
    role: user.role
  };
  const request = axios.put(
    `${ROOT_URL}/customers/${cUUID}/users/${userUUID}/update_profile`,
    data
  );
  return {
    type: UPDATE_USER_PROFILE,
    payload: request
  };
}

export function updateUserProfileSuccess(response) {
  return {
    type: UPDATE_USER_PROFILE_SUCCESS,
    payload: response
  };
}

export function updateUserProfileFailure(error) {
  return {
    type: UPDATE_USER_PROFILE_FAILURE,
    payload: error
  };
}

export function fetchSoftwareVersions() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/releases`);
  return {
    type: FETCH_SOFTWARE_VERSIONS,
    payload: request
  };
}

export function fetchSoftwareVersionsSuccess(result) {
  return {
    type: FETCH_SOFTWARE_VERSIONS_SUCCESS,
    payload: result
  };
}

export function fetchSoftwareVersionsFailure(error) {
  return {
    type: FETCH_SOFTWARE_VERSIONS_FAILURE,
    payload: error
  };
}

export function getTlsCertificates() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/certificates`);
  return {
    type: FETCH_TLS_CERTS,
    payload: request
  };
}

export function getTlsCertificatesResponse(result) {
  return {
    type: FETCH_TLS_CERTS_RESPONSE,
    payload: result
  };
}

export function addCertificate(config) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.post(`${ROOT_URL}/customers/${cUUID}/certificates`, config);
  return {
    type: ADD_TLS_CERT,
    payload: request
  };
}

export function addCertificateResponse(response) {
  return {
    type: ADD_TLS_CERT_RESPONSE,
    payload: response
  };
}

export function addCertificateReset() {
  return {
    type: ADD_TLS_CERT_RESET
  };
}

export function retrieveClientCertificate(certUUID, config) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.post(`${ROOT_URL}/customers/${cUUID}/certificates/${certUUID}`, config);
  return {
    type: FETCH_CLIENT_CERT,
    payload: request
  };
}

export function fetchRootCertificate(certUUID) {
  const url = `${getCustomerEndpoint()}/certificates/${certUUID}/download`;
  const request = axios.get(url);
  return {
    type: FETCH_CLIENT_CERT, // Reuse client cert action type b/c we don't have a reducer case yet
    payload: request
  };
}

export function fetchHostInfo() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/host_info`);
  return {
    type: FETCH_HOST_INFO,
    payload: request
  };
}

export function fetchHostInfoSuccess(result) {
  return {
    type: FETCH_HOST_INFO_SUCCESS,
    payload: result
  };
}

export function fetchHostInfoFailure(error) {
  return {
    type: FETCH_HOST_INFO_FAILURE,
    payload: error
  };
}

export function fetchCustomerCount() {
  const request = axios.get(`${ROOT_URL}/customer_count`);
  return {
    type: FETCH_CUSTOMER_COUNT,
    payload: request
  };
}

export function getAlerts() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/alerts/active`);
  return {
    type: GET_ALERTS,
    payload: request
  };
}

export function createAlertChannel(payload) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.post(`${ROOT_URL}/customers/${cUUID}/alert_channels`, payload);
  return {
    type: CREATE_ALERT_CHANNEL,
    payload: request
  };
}

export function createAlertChannelResponse(response) {
  return {
    type: CREATE_ALERT_CHANNEL_RESPONSE,
    payload: response
  };
}

export function updateAlertChannel(channelUUID, payload){
  const cUUID = localStorage.getItem('customerId');
  const request = axios.put(`${ROOT_URL}/customers/${cUUID}/alert_channels/${channelUUID}`, payload);
  return {
    type: UPDATE_ALERT_CHANNEL,
    payload: request
  };
}

export function deleteAlertChannel(channelUUID){
  const cUUID = localStorage.getItem('customerId');
  const request = axios.delete(`${ROOT_URL}/customers/${cUUID}/alert_channels/${channelUUID}`);
  return {
    type: DELETE_ALERT_CHANNEL,
    payload: request
  };
}

export function createAlertDestination(payload) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.post(`${ROOT_URL}/customers/${cUUID}/alert_destinations`, payload);
  return {
    type: CREATE_ALERT_DESTINATION,
    payload: request
  };
}

export function createAlertDestinationResponse(response) {
  return {
    type: CREATE_ALERT_DESTINATION_RESPONSE,
    payload: response
  };
}

export function createAlertConfig(payload) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.post(`${ROOT_URL}/customers/${cUUID}/alert_configurations`, payload);
  return {
    type: CREATE_ALERT_CONFIG,
    payload: request
  };
}

export function updateAlertConfig(payload, uuid) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.put(
    `${ROOT_URL}/customers/${cUUID}/alert_configurations/${uuid}`,
    payload
  );
  return {
    type: UPDATE_ALERT_CONFIG,
    payload: request
  };
}

export function updateAlertConfigResponse(response) {
  return {
    type: UPDATE_ALERT_CONFIG_RESPONSE,
    payload: response
  };
}

export function createAlertConfigResponse(response) {
  return {
    type: CREATE_ALERT_CONFIG_RESPONSE,
    payload: response
  };
}

export function updateAlertDestination(payload, uuid) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.put(`${ROOT_URL}/customers/${cUUID}/alert_destinations/${uuid}`, payload);
  return {
    type: UPDATE_ALERT_DESTINATION,
    payload: request
  };
}

export function updateAlertDestinationResponse(response) {
  return {
    type: UPDATE_ALERT_DESTINATION_RESPONSE,
    payload: response
  };
}

export function deleteAlertDestination(uuid) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.delete(`${ROOT_URL}/customers/${cUUID}/alert_destinations/${uuid}`);
  return {
    type: DELETE_ALERT_DESTINATION,
    payload: request
  };
}

export function deleteAlertConfig(uuid) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.delete(`${ROOT_URL}/customers/${cUUID}/alert_configurations/${uuid}`);
  return {
    type: DELETE_ALERT_CONFIG,
    payload: request
  };
}

export function getAlertConfigByName(name) {
  const cUUID = localStorage.getItem('customerId');
  return axios.post(`${ROOT_URL}/customers/${cUUID}/alert_configurations/list`, {name});
}

export function getAlertChannels() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/alert_channels`);
  return {
    type: GET_ALERT_CHANNELS,
    payload: request
  };
}

export function getAlertChannelsSuccess(response) {
  return {
    type: GET_ALERT_CHANNELS_SUCCESS,
    payload: response
  };
}

export function getAlertChannelsFaliure(response) {
  return {
    type: GET_ALERT_CHANNELS_FAILURE,
    payload: response
  };
}

export function alertDestinations() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/alert_destinations`);
  return {
    type: GET_ALERT_DESTINATIONS,
    payload: request
  };
}

export function getTargetMetrics(payload) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.post(`${ROOT_URL}/customers/${cUUID}/alert_templates`, {
    targetType: payload
  });
  return {
    type: GET_ALERT_TEMPLATES,
    payload: request
  };
}

export function alertConfigs(payload) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.post(
    `${ROOT_URL}/customers/${cUUID}/alert_configurations/list`,
    payload
  );
  return {
    type: GET_ALERT_CONFIGS,
    payload: request
  };
}

export function getAlertsSuccess(response) {
  return {
    type: GET_ALERTS_SUCCESS,
    payload: response
  };
}

export function getAlertsFailure(error) {
  return {
    type: GET_ALERTS_FAILURE,
    payload: error
  };
}

export function getCustomerUsers() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/users`);
  return {
    type: GET_CUSTOMER_USERS,
    payload: request
  };
}

export function getCustomerUsersSuccess(response) {
  return {
    type: GET_CUSTOMER_USERS_SUCCESS,
    payload: response
  };
}

export function getCustomerUsersFailure(error) {
  return {
    type: GET_CUSTOMER_USERS_FAILURE,
    payload: error
  };
}

export function fetchYugaWareVersion() {
  const request = axios.get(`${ROOT_URL}/app_version`);
  return {
    type: FETCH_YUGAWARE_VERSION,
    payload: request
  };
}

export function fetchYugaWareVersionResponse(response) {
  return {
    type: FETCH_YUGAWARE_VERSION_RESPONSE,
    payload: response
  };
}

export function addCustomerConfig(config) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.post(`${ROOT_URL}/customers/${cUUID}/configs`, config);
  return {
    type: ADD_CUSTOMER_CONFIG,
    payload: request
  };
}

export function setInitialValues(initialValues) {
  return {
    type: SET_INITIAL_VALUES,
    payload: initialValues
  };
}

export function addCustomerConfigResponse(response) {
  return {
    type: ADD_CUSTOMER_CONFIG_RESPONSE,
    payload: response
  };
}

export function editCustomerConfig(config) {
  const cUUID = localStorage.getItem('customerId');
  const configUUID = config.configUUID;
  const request = axios.put(`${ROOT_URL}/customers/${cUUID}/configs/${configUUID}`, config);
  return {
    type: EDIT_CUSTOMER_CONFIG,
    payload: request
  };
}

export function editCustomerConfigResponse(response) {
  return {
    type: EDIT_CUSTOMER_CONFIG_RESPONSE,
    payload: response
  };
}

export function deleteCustomerConfig(configUUID) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.delete(`${ROOT_URL}/customers/${cUUID}/configs/${configUUID}`);
  return {
    type: DELETE_CUSTOMER_CONFIG,
    payload: request
  };
}

export function deleteCustomerConfigResponse(response) {
  return {
    type: DELETE_CUSTOMER_CONFIG_RESPONSE,
    payload: response
  };
}

export function fetchCustomerConfigs() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/configs`);
  return {
    type: FETCH_CUSTOMER_CONFIGS,
    payload: request
  };
}

export function fetchCustomerConfigsResponse(response) {
  return {
    type: FETCH_CUSTOMER_CONFIGS_RESPONSE,
    payload: response
  };
}

export function getSchedules() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/schedules`);
  return {
    type: GET_SCHEDULES,
    payload: request
  };
}

export function getSchedulesResponse(response) {
  return {
    type: GET_SCHEDULES_RESPONSE,
    payload: response
  };
}

export function deleteSchedule(scheduleUUID) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.delete(`${ROOT_URL}/customers/${cUUID}/schedules/${scheduleUUID}`);
  return {
    type: DELETE_SCHEDULE,
    payload: request
  };
}

export function deleteScheduleResponse(response) {
  return {
    type: DELETE_SCHEDULE_RESPONSE,
    payload: response
  };
}

export function getLogs() {
  // TODO(bogdan): Maybe make this a URL param somehow?
  const request = axios.get(`${ROOT_URL}/logs/1000`);
  return {
    type: FETCH_HOST_INFO,
    payload: request
  };
}

export function getLogsSuccess(result) {
  return {
    type: GET_LOGS_SUCCESS,
    payload: result
  };
}

export function getLogsFailure(error) {
  return {
    type: GET_LOGS_FAILURE,
    payload: error
  };
}

export function getYugaByteReleases() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/releases?includeMetadata=true`);
  return {
    type: GET_RELEASES,
    payload: request
  };
}

export function getYugaByteReleasesResponse(response) {
  return {
    type: GET_RELEASES_RESPONSE,
    payload: response
  };
}

export function refreshYugaByteReleases() {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.put(`${ROOT_URL}/customers/${cUUID}/releases`);
  return {
    type: REFRESH_RELEASES,
    payload: request
  };
}

export function refreshYugaByteReleasesResponse(response) {
  return {
    type: REFRESH_RELEASES_RESPONSE,
    payload: response
  };
}

export function importYugaByteRelease(payload) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.post(`${ROOT_URL}/customers/${cUUID}/releases`, payload);
  return {
    type: IMPORT_RELEASE,
    payload: request
  };
}

export function importYugaByteReleaseResponse(response) {
  return {
    type: IMPORT_RELEASE_RESPONSE,
    payload: response
  };
}

export function updateYugaByteRelease(version, payload) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.put(`${ROOT_URL}/customers/${cUUID}/releases/${version}`, payload);
  return {
    type: UPDATE_RELEASE,
    payload: request
  };
}

export function updateYugaByteReleaseResponse(response) {
  return {
    type: UPDATE_RELEASE_RESPONSE,
    payload: response
  };
}

export function createUser(formValues) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.post(`${ROOT_URL}/customers/${cUUID}/users`, formValues);
  return {
    type: CREATE_USER,
    payload: request
  };
}

export function createUserSuccess(response) {
  return {
    type: CREATE_USER_SUCCESS,
    payload: response
  };
}

export function createUserFailure(error) {
  return {
    type: CREATE_USER_FAILURE,
    payload: error
  };
}

export function changeUserRole(userUUID, newRole) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.put(`${ROOT_URL}/customers/${cUUID}/users/${userUUID}?role=${newRole}`);
  return {
    type: CHANGE_USER_ROLE,
    payload: request
  };
}

export function fetchUser(userUUID) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.get(`${ROOT_URL}/customers/${cUUID}/users/${userUUID}`);
  return {
    type: FETCH_USER,
    payload: request
  };
}

export function fetchUserSuccess(response) {
  return {
    type: FETCH_USER_SUCCESS,
    payload: response
  };
}

export function fetchUserFailure(error) {
  return {
    type: FETCH_USER_FAILURE,
    payload: error
  };
}

export function deleteUser(userUUID) {
  const cUUID = localStorage.getItem('customerId');
  const request = axios.delete(`${ROOT_URL}/customers/${cUUID}/users/${userUUID}`);
  return {
    type: DELETE_USER,
    payload: request
  };
}

export function deleteUserResponse(response) {
  return {
    type: DELETE_USER_RESPONSE,
    payload: response
  };
}

export function updateTLS(universeUuid, formValues) {
  const cUUID = localStorage.getItem('customerId');
  const values = {
    "enableNodeToNodeEncrypt": formValues.enableNodeToNodeEncrypt,
    "enableClientToNodeEncrypt": formValues.enableClientToNodeEncrypt,
    "rootCA": formValues.rootCA,
    "createNewRootCA": formValues.createNewRootCA,
    "clientRootCA": formValues.clientRootCA,
    "createNewClientRootCA": formValues.createNewClientRootCA,
    "rootAndClientRootCASame": formValues.rootAndClientRootCASame,
    "upgradeOption": formValues.rollingUpgrade ? "Rolling" : "Non-Rolling",
    "sleepAfterMasterRestartMillis": formValues.timeDelay * 1000,
    "sleepAfterTServerRestartMillis": formValues.timeDelay * 1000
  }
  const request = axios.post(
    `${ROOT_URL}/customers/${cUUID}/universes/${universeUuid}/update_tls`,
    values
  );
  return {
    type: UPDATE_TLS,
    payload: request
  };
}

import { message } from 'antd';

import { notification } from '@tenx-ui/materials';

import { createRef } from 'react';
import { sdk as bff } from '../bff-sdk';

export const AUTH_DATA = 'authData';

export const getAuthData = () => {
  try {
    const authData = JSON.parse(window.localStorage.getItem(AUTH_DATA) || '{}');
    return authData;
  } catch (error) {
    console.warn('getAuthData failed', error);
    return {};
  }
};

export const setAuthData = (data) => {
  window.localStorage.setItem(AUTH_DATA, JSON.stringify(data));
};

export const removeAuthData = () => {
  window.localStorage.removeItem(AUTH_DATA);
  window.sessionStorage.removeItem(AUTH_DATA);
};

export const parseToken = function parseToken(token) {
  return token
    .split('.')
    .map((str) => {
      try {
        return JSON.parse(atob(str));
      } catch (e) {
        // do sth
      }
      return {};
    })
    .reduce(
      (pr, cu) => ({
        ...pr,
        ...cu,
      }),
      {}
    );
};

export const isTokenExpired = function isTokenExpired(token) {
  token = token || getAuthData()?.token?.id_token;
  if (!token) {
    return true;
  }
  const expiredTimestampInMs = parseToken(token).exp * 1000;
  return new Date().getTime() >= expiredTimestampInMs;
};

export const paginationShowTotal = function paginationShowTotal(
  total,
  range,
  props
) {
  return `${props.i18n('i18n-5xl7aihzcuy')} ${total} ${props.i18n(
    'i18n-v7xu122b9o'
  )}`;
};

export const formatCpu = (v) => {
  if (v.includes('m')) {
    return parseFloat(v) / 1000;
  }
  return parseFloat(v);
};

export class RefsManager {
  constructor() {
    this.refInsStore = {};
  }

  clearNullRefs() {
    Object.keys(this.refInsStore).forEach((refName) => {
      const filteredInsList = this.refInsStore[refName].filter(
        (insRef) => !!insRef.current
      );
      if (filteredInsList.length > 0) {
        this.refInsStore[refName] = filteredInsList;
      } else {
        delete this.refInsStore[refName];
      }
    });
  }

  get(refName) {
    this.clearNullRefs();
    if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
      return this.refInsStore[refName][0].current;
    }

    return null;
  }

  getAll(refName) {
    this.clearNullRefs();
    if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
      return this.refInsStore[refName].map((i) => i.current);
    }

    return [];
  }

  linkRef(refName) {
    const refIns = createRef();
    this.refInsStore[refName] = this.refInsStore[refName] || [];
    this.refInsStore[refName].push(refIns);
    return refIns;
  }
}

export default {
  bff,

  message,

  notification,

  AUTH_DATA,

  getAuthData,

  setAuthData,

  removeAuthData,

  parseToken,

  isTokenExpired,

  paginationShowTotal,

  formatCpu,
};

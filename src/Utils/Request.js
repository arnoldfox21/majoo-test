import React from "react";
import axios from "axios";
import get from "lodash/get";
import { message, notification, Button } from "antd";

import Urls from "./Urls";
import Config from './Config';

const CancelToken = axios.CancelToken;
let api,
  btn,
  parentArgs,
  instance = {};

function Request(
  method = "GET",
  token,
  urlKey,
  headers = {},
  data = {},
  args = [],
  onSuccess = () => { },
  onFailed = () => { },
  extra = undefined,
  init = null,
  options = {},
) {
  if (typeof headers !== "object")
    throw Error("Invalid headers, headers must be an object");

  headers = {
    Authorization: "Token " + token,
    "Content-Type": "application/json",
    ...headers
  };

  if (!Array.isArray(args))
    throw Error("Invalid arguments, data must be an array");

  if (typeof onSuccess !== "function")
    throw Error("Invalid onSuccess, onSuccess must be a function");

  if (typeof onFailed !== "function")
    throw Error("Invalid onFailed, onFailed must be a function");

  if (typeof axios[method.toLowerCase()] !== "function")
    throw Error("Invalid method");

  if (method.toLowerCase() === "get" && data) data = { params: data };

  axios.defaults.headers = headers

  api = Urls[urlKey];

  let paramUrlData = Config.api

  args.map(v => (urlKey = (urlKey || '').replace("{}", v)));
  if (!api) {
    api = urlKey;
    paramUrlData = '';
    // } else if (!api) throw Error("Invalid url key");
  } else if (!api) {
    // notification.error({ key: "urlApiNotFound", message: "Error Code!", description: "URL API Not Found!", duration: 10 });
    return onFailed({
      response: {
        data: {
          detail: `Invalid url key of ${urlKey}, need fix in code.`
        }
      }
    }, extra)
  }

  args.map(v => (api = api.replace("{}", v)));

  btn = (
    <Button size="small" onClick={() => window.location.reload()}>
      Reload
    </Button>
  );
  parentArgs = arguments;
  return axios[method.toLowerCase()](paramUrlData + api, data, {
    cancelToken: new CancelToken(c => (instance.cancel = c)),
    ...options,
  })
    .then(r => {
      onSuccess(r, extra);
      return r;
    })
    .catch(error => {
      if (typeof error !== "undefined") {
        if (typeof error.response !== "undefined") {
          console.error('Request Failed.', error.response)
          /* refresh token */
          if (typeof error.response.statusText !== "undefined") {
            if (
              String(error.response.status) === "401" &&
              error.response.data.detail === "Authentication credentials were not provided." &&
              // error.response.statusText === "Unauthorized" &&
              error.response.data.error !== "invalid_grant" &&
              !get(extra, 'withoutRefreshToken')
            ) {
              // RefreshToken(parentArgs);
              return
            }
          }
          /* === */
          if (typeof error.response.data !== "undefined") {
            if (
              typeof error.response.data === "object" ||
              get(extra, "isRefreshToken", false)
            ) {
              onFailed(error, extra);
            } else {
              onFailed(error, extra);
            }
          }
        } else if (error.toString() === "Cancel") {
          onFailed({
            response: {
              data: {
                detail: error.message ? error.message : "Operation canceled!"
              }
            }
          }, extra);
        } else {
          //Debug.isDevMode && console.log(error);
          notification.error({
            key: "netError",
            message: "Error!",
            description:
              "Network connection refused. Please check your connection!",
            duration: 15,
            btn
          });
          onFailed({
            response: { data: { detail: "Connection to Server Failed!" } }
          }, extra);
        }
      }
      return init;
    });
}

export default Request;

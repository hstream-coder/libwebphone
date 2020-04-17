"use strict";

import i18next from "i18next";
import EventEmitter from "eventemitter2";

import { merge } from "./lwpUtils";
import lwpUserAgent from "./lwpUserAgent";
import lwpCallList from "./lwpCallList";
import lwpCallControl from "./lwpCallControl";
import lwpDialpad from "./lwpDialpad";
import lwpMediaDevices from "./lwpMediaDevices";
import lwpVideoCanvas from "./lwpVideoCanvas";
import lwpAudioContext from "./lwpAudioContext";

export default class extends EventEmitter {
  constructor(config = {}) {
    super();
    this._libwebphone = this;
    this._initProperties(config);
    this._initInternationalization(this._config.i18n);

    if (this._config.userAgent.enabled) {
      this._userAgent = new lwpUserAgent(this, this._config.userAgent);
    }

    if (this._config.callList.enabled) {
      this._callList = new lwpCallList(this, this._config.callList);
    }

    if (this._config.audioContext.enabled) {
      this._audioContext = new lwpAudioContext(this, this._config.audioContext);
    }

    if (this._config.mediaDevices.enabled) {
      this._mediaDevices = new lwpMediaDevices(this, this._config.mediaDevices);
    }

    if (this._config.callControl.enabled) {
      this._callControl = new lwpCallControl(this, this._config.callControl);
    }

    if (this._config.dialpad.enabled) {
      this._dialpad = new lwpDialpad(this, this._config.dialpad);
    }

    if (this._config.videoCanvas.enabled) {
      this._videoCanvas = new lwpVideoCanvas(this, this._config.videoCanvas);
    }

    if (this._config.mediaPreviews.enabled) {
      this._mediaPreviews = new lwpMediaPreviews(
        this,
        this._config.mediaPreviews
      );
    }

    this._libwebphone._emit("created", this._libwebphone);
  } //end of constructor

  getCallControl() {
    return this._callControl;
  }

  getCallList() {
    return this._callList;
  }

  getDialpad() {
    return this._dialpad;
  }

  getUserAgent() {
    return this._userAgent;
  }

  getMediaDevices() {
    return this._mediaDevices;
  }

  getVideoCanvas() {
    return this._videoCanvas;
  }

  getAudioContext() {
    return this._audioContext;
  }

  getMediaPreviews() {
    return this._mediaPreviews;
  }

  geti18n() {
    return i18next;
  }

  i18nAddResourceBundles(module, resources) {
    for (let lang in resources) {
      this.i18nAddResourceBundle(module, lang, resources[lang]);
    }
  }

  i18nAddResourceBundle(module, lang, resource) {
    let bundle = {};
    bundle[module] = resource;
    i18next.addResourceBundle(lang, "libwebphone", bundle, true);
    this._libwebphone._emit(
      "language.bundle.added",
      this._libwebphone,
      lang,
      bundle
    );
  }

  i18nTranslator() {
    return this._translator;
  }

  /** Init functions */

  _initProperties(config) {
    var defaults = {
      i18n: { fallbackLng: "en" },
      dialpad: { enabled: true },
      callList: { enabled: true },
      callControl: { enabled: true },
      mediaDevices: { enabled: true },
      mediaPreviews: { enabled: false },
      audioContext: { enabled: true },
      userAgent: { enabled: true },
      videoCanvas: { enabled: false },
    };
    this._config = merge(defaults, config);
  }

  _initInternationalization(config) {
    this._i18nPromise = i18next.init(config).then((translator) => {
      this._translator = translator;
      this._libwebphone._emit(
        "language.changed",
        this._libwebphone,
        translator
      );
    });
  }

  /** Helper functions */

  _callListEvent(type, callList, ...data) {
    data.unshift(callList);
    data.unshift(this._libwebphone);
    data.unshift("callList." + type);
    this._libwebphone._emit.apply(this._libwebphone, data);
  }

  _callControlEvent(type, callControl, ...data) {
    data.unshift(callControl);
    data.unshift(this._libwebphone);
    data.unshift("callControl." + type);
    this._libwebphone._emit.apply(this._libwebphone, data);
  }
  _dialpadEvent(type, dialpad, ...data) {
    data.unshift(dialpad);
    data.unshift(this._libwebphone);
    data.unshift("dialpad." + type);
    this._libwebphone._emit.apply(this._libwebphone, data);
  }

  _userAgentEvent(type, userAgent, ...data) {
    data.unshift(userAgent);
    data.unshift(this._libwebphone);
    data.unshift("userAgent." + type);
    this._libwebphone._emit.apply(this._libwebphone, data);
  }

  _mediaDevicesEvent(type, mediaDevices, ...data) {
    data.unshift(mediaDevices);
    data.unshift(this._libwebphone);
    data.unshift("mediaDevices." + type);
    this._libwebphone._emit.apply(this._libwebphone, data);
  }

  _audioContextEvent(type, audioContext, ...data) {
    data.unshift(audioContext);
    data.unshift(this._libwebphone);
    data.unshift("audioContext." + type);
    this._libwebphone._emit.apply(this._libwebphone, data);
  }

  _callEvent(type, call, ...data) {
    data.unshift(call);
    data.unshift(this._libwebphone);
    data.unshift("call." + type);

    this._libwebphone._emit.apply(this._libwebphone, data);

    if (call.isPrimary()) {
      data.shift();
      data.unshift("call.primary." + type);
      this._libwebphone._emit.apply(this._libwebphone, data);

      data.shift();
      data.unshift("call.primary.update");
      data.push(type);
      this._libwebphone._emit.apply(this._libwebphone, data);
    }
  }

  _videoCanvasEvent(type, video, ...data) {
    data.unshift(video);
    data.unshift(this._libwebphone);
    data.unshift("videoCanvas." + type);
    this._libwebphone._emit.apply(this._libwebphone, data);
  }

  _emit(...args) {
    this.emit(...args);
  }
} //End of default class

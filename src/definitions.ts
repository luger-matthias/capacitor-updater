/// <reference types="@capacitor/cli" />
import type { PluginListenerHandle } from '@capacitor/core';

declare module '@capacitor/cli' {
  export interface PluginsConfig {
    /**
     * These configuration values are available:
     */
    CapacitorUpdater?: {
      /**
       * Configure the number of milliseconds the native plugin should wait before considering an update 'failed'.
       *
       * Only available for Android and iOS.
       *
       * @default 10000 // (10 seconds)
       * @example 1000 // (1 second)
       */
      appReadyTimeout?: number;

      /**
       * Configure whether the plugin should use automatically delete failed bundles.
       *
       * Only available for Android and iOS.
       *
       * @default true
       * @example false
       */
      autoDeleteFailed?: boolean;

      /**
       * Configure whether the plugin should use automatically delete previous bundles after a successful update.
       *
       * Only available for Android and iOS.
       *
       * @default true
       * @example false
       */
      autoDeletePrevious?: boolean;

      /**
       * Configure whether the plugin should use Auto Update via an update server.
       *
       * Only available for Android and iOS.
       *
       * @default false
       * @example false
       */
      autoUpdate?: boolean;

      /**
       * Configure the URL / endpoint to which update checks are sent. 
       *
       * Only available for Android and iOS.
       *
       * @default https://capgo.app/api/auto_update
       * @example https://example.com/api/auto_update
       */
      updateUrl?: string;

      /**
       * Automatically delete previous downloaded bundles when a newer native app version is installed to the device.
       *
       * Only available for Android and iOS.
       *
       * @default true
       * @example false
       */
      resetWhenUpdate?: boolean;

      /**
       * Configure the URL / endpoint to which update statistics are sent. 
       *
       * Only available for Android and iOS.
       *
       * @default https://capgo.app/api/stats
       * @example https://example.com/api/stats
       */
      statsUrl?: string;
    };
  }
}


export interface DownloadEvent {
  /**
   * Current status of download, between 0 and 100.
   *
   * @since  4.0.0
   */
  percent: number;
  bundle: BundleInfo;
}
export interface MajorAvailableEvent {
  /**
   * Emit when a new major version is available.
   *
   * @since  4.0.0
   */
  version: string;
}
export interface DownloadCompleteEvent {
  /**
   * Emit when a new update is available.
   *
   * @since  4.0.0
   */
  bundle: BundleInfo;
}

export interface UpdateFailedEvent {
  /**
   * Emit when a update failed to install.
   *
   * @since 4.0.0
   */
   bundle: BundleInfo;
}

export interface latestVersion {
  /**
   * Res of getLatest method
   *
   * @since 4.0.0
   */
  version: string,
  major?: boolean,
  message?: string,
  old?: string,
  url?: string,
}

export interface BundleInfo {
  id: string;
  version: string;
  downloaded: string;
  status: BundleStatus
}

export type BundleStatus = 'success' | 'error' | 'pending' | 'downloading';
export type DelayUntilNext = 'background' | 'kill' | 'nativeVersion' | 'date';

export type DownloadChangeListener = (state: DownloadEvent) => void;
export type DownloadCompleteListener = (state: DownloadCompleteEvent) => void;
export type MajorAvailableListener = (state: MajorAvailableEvent) => void;
export type UpdateFailedListener = (state: UpdateFailedEvent) => void;




export interface CapacitorUpdaterPlugin {

  /**
   * Notify Capacitor Updater that the current bundle is working (a rollback will occur of this method is not called on every app launch)
   *
   * @returns {Promise<BundleInfo>} an Promise resolved directly
   * @throws An error if the something went wrong
   */
  notifyAppReady(): Promise<BundleInfo>;

  /**
   * Download a new version from the provided URL, it should be a zip file, with files inside or with a unique id inside with all your files
   *
   * @returns {Promise<BundleInfo>} The {@link BundleInfo} for the specified version.
   * @param url The URL of the bundle zip file (e.g: dist.zip) to be downloaded. (This can be any URL. E.g: Amazon S3, a github tag, any other place you've hosted your bundle.)
   * @param version set the version code/name of this bundle/version
   * @example https://example.com/versions/{version}/dist.zip 
   */
  download(options: { url: string, version: string }): Promise<BundleInfo>;

  /**
   * Set the next bundle to be used when the app is reloaded.
   *
   * @returns {Promise<BundleInfo>} The {@link BundleInfo} for the specified bundle id.
   * @param id The bundle id to set as current, next time the app is reloaded. See {@link BundleInfo.id}
   * @throws An error if there are is no index.html file inside the version folder.
   */
  next(options: { id: string }): Promise<BundleInfo>;

  /**
   * Set the current bundle and immediately reloads the app.
   *
   * @param id The bundle id to set as current. See {@link BundleInfo.id}
   * @returns {Promise<Void>} An empty promise.
   * @throws An error if there are is no index.html file inside the version folder.
   */
  set(options: { id: string }): Promise<void>;

  /**
   * Delete bundle in storage
   *
   * @returns {Promise<void>} an empty Promise when the bundle is deleted
   * @param id The bundle id to delete (note, this is the bundle id, NOT the version name)
   * @throws An error if the something went wrong
   */
  delete(options: { id: string }): Promise<void>;

  /**
   * Get all available versions
   *
   * @returns {Promise<{version: BundleInfo[]}>} an Promise witht the version list
   * @throws An error if the something went wrong
   */
  list(): Promise<{ bundles: BundleInfo[] }>;

  /**
   * Set the `builtin` version (the one sent to Apple store / Google play store ) as current version
   *
   * @returns {Promise<void>} an empty Promise
   * @param toLastSuccessful [false] if yes it reset to to the last successfully loaded bundle instead of `builtin`
   * @throws An error if the something went wrong
   */
  reset(options?: { toLastSuccessful?: boolean }): Promise<void>;

  /**
   * Get the current bundle, if none are set it returns `builtin`, currentNative is the original bundle installed on the device
   *
   * @returns {Promise<{ bundle: BundleInfo, native: string }>} an Promise with the current bundle info
   * @throws An error if the something went wrong
   */
  current(): Promise<{ bundle: BundleInfo, native: string }>;

  /**
   * Reload the view
   *
   * @returns {Promise<void>} an Promise resolved when the view is reloaded
   * @throws An error if the something went wrong
   */
  reload(): Promise<void>;

  /**
   * Set delay to skip updates in the next time the app goes into the background
   *
   * @returns {Promise<void>} an Promise resolved directly
   * @param kind is the kind of delay to set
   * @param value is the delay value acording to the type
   * @throws An error if the something went wrong
   * @since 4.0.0
   */
  setDelay(options: {kind: DelayUntilNext, value?: string}): Promise<void>;

  /**
   * Cancel delay to updates as usual
   *
   * @returns {Promise<void>} an Promise resolved directly
   * @throws An error if the something went wrong
   * @since 4.0.0
   */
  cancelDelay(): Promise<void>;

  /**
   * Get Latest version available from update Url
   *
   * @returns {Promise<latestVersion>} an Promise resolved when url is loaded
   * @throws An error if the something went wrong
   * @since 4.0.0
   */
  getLatest(options: {delay: boolean}): Promise<latestVersion>;

  /**
   * Listen for download event in the App, let you know when the download is started, loading and finished
   *
   * @since 2.0.11
   */
  addListener(
    eventName: 'download',
    listenerFunc: DownloadChangeListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  /**
   * Listen for download event in the App, let you know when the download is started, loading and finished
   *
   * @since 4.0.0
   */
  addListener(
    eventName: 'downloadComplete',
    listenerFunc: DownloadCompleteListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
  
  /**
   * Listen for Major update event in the App, let you know when major update is blocked by setting disableAutoUpdateBreaking
   *
   * @since 2.3.0
   */
  addListener(
    eventName: 'majorAvailable',
    listenerFunc: MajorAvailableListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

    /**
   * Listen for update fail event in the App, let you know when update hs fail to install at next app start
   *
   * @since 2.3.0
   */
  addListener(
      eventName: 'updateFailed',
      listenerFunc: UpdateFailedListener,
    ): Promise<PluginListenerHandle> & PluginListenerHandle;

  /**
   * Get unique ID used to identify device (sent to auto update server)
   *
   * @returns {Promise<{ id: string }>} an Promise with id for this device
   * @throws An error if the something went wrong
   */
  getId(): Promise<{ id: string }>;

  /**
   * Get the native Capacitor Updater plugin version (sent to auto update server)
   *
   * @returns {Promise<{ id: string }>} an Promise with version for this device
   * @throws An error if the something went wrong
   */
  getPluginVersion(): Promise<{ version: string }>;

  /**
   * Get the state of auto update config. This will return `false` in manual mode.
   *
   * @returns {Promise<{enabled: boolean}>} The status for auto update.
   * @throws An error if the something went wrong
   */
  isAutoUpdateEnabled(): Promise<{ enabled: boolean }>;
}

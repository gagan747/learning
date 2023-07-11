/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 * Some keys such as license_key, agent_enabled and distributed_tracing will be provided via the pipeline
 * as environment variable overwriting the values in this config files
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['UAT-Murray - Service BFF Sports'],

  license_key: 'TO_BE_REPLACED_BY_ENV_VAR',
  agent_enabled: true,
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info',
  },
  error_collector: {
    ignore_status_codes: [404, 412, 400, 422, 409],
  },
  labels: `Application:${process.env.SERVICE_NAME};Environment:${ process.env.STACK_NAME || process.env.APP_ENV }`,
};

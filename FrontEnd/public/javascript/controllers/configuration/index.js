/**
 * This is the file linked to the html, it's going to serve up the ConfigurationController
 */
import ConfigurationController from "./configuration";
import default_configs from '../../resources/default_configs'

ConfigurationController(default_configs);
console.log('tee-hee')
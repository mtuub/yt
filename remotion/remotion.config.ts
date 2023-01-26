import { Config } from "remotion";

Config.Rendering.setImageFormat("jpeg");
Config.Output.setOverwriteOutput(true);
Config.Bundling.setPort(3003);
Config.Rendering.setConcurrency(16);

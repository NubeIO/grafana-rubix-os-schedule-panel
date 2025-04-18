## ⚠️ Deprecated!

**This repository is deprecated.** <br />
A more up-to-date version of panel plugin examples is available here: https://github.com/grafana/grafana-plugin-examples#panel-plugins

**Examples:**
- [panel-basic](https://github.com/grafana/grafana-plugin-examples/blob/main/examples/panel-basic) - demonstrates how to build a panel plugin that uses the time series graph
- [panel-flot](https://github.com/grafana/grafana-plugin-examples/blob/main/examples/panel-flot) - demonstrates how to use the Flot plotting library in a panel plugin.
- [panel-plotly](https://github.com/grafana/grafana-plugin-examples/blob/main/examples/panel-plotly) - demonstrates how to use the Plotly graphing library in a panel plugin.

---

# Grafana Panel Plugin Template

[![Build](https://github.com/grafana/grafana-starter-panel/workflows/CI/badge.svg)](https://github.com/grafana/grafana-starter-panel/actions?query=workflow%3A%22CI%22)

This template is a starting point for building Grafana Panel Plugins in Grafana 7.0+

## What is Grafana Panel Plugin?

Panels are the building blocks of Grafana. They allow you to visualize data in different ways. While Grafana has several types of panels already built-in, you can also build your own panel, to add support for other visualizations.

For more information about panels, refer to the documentation on [Panels](https://grafana.com/docs/grafana/latest/features/panels/panels/)

## Getting started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Build plugin in development mode or run in watch mode

   ```bash
   yarn dev
   ```

   or

   ```bash
   yarn watch
   ```

3. Build plugin in production mode

   ```bash
   yarn build
   ```

## Learn more

- [Build a panel plugin tutorial](https://grafana.com/tutorials/build-a-panel-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana Design System


## Build on Docker

```bash
yarn install
yarn build
docker-compose up
```

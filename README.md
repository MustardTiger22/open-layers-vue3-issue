# Vue OpenLayers Map Issue

This repository contains a Vue application utilizing the OpenLayers library for displaying maps. It's designed to demonstrate and potentially address an issue related to styling selected geopoints on the map.

## Problem Description

When selecting a geopoint on the map, the intended custom style is applied correctly. However, upon zooming in or out, the selected geopoint's style reverts to the default. This behavior is unexpected and undesirable, as the selected geopoint should maintain its custom style regardless of the zoom level.

## Steps to Reproduce

1. Load the map application.
2. Select a geopoint on the map.
3. Zoom in or out.
4. Observe the selected geopoint's style revert to default.

## Expected Behavior

The selected geopoint's style should remain consistent and not revert to default upon zooming in or out.

## Reproduction Repository

This issue can be reproduced using the provided code repository. Follow the instructions in the README to set up the application and observe the problem.
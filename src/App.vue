<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue";
import { Map, View } from "ol";

export type GeoPoint = {
  id?: number;
  longitude: number;
  latitude: number;
};

const POLAND_CENTER_LATITUDE = 51.9194;
const POLAND_CENTER_LONGITUDE = 19.1451;
const DEFAULT_ZOOM = 7;

const selectConditions = inject("ol-selectconditions");
const mapRef = ref<{ map: Map }>();
const viewRef = ref<{ view: View }>();
const vectorRef = ref();
const selectInteractionsRef = ref();
const projection = ref("EPSG:4326");
const zoom = ref(DEFAULT_ZOOM);
const rotation = ref(0);
const center = ref([POLAND_CENTER_LONGITUDE, POLAND_CENTER_LATITUDE]);
const selectedPointId = ref();
const geoPoints: GeoPoint[] = [
  {
    id: 1,
    longitude: POLAND_CENTER_LONGITUDE,
    latitude: POLAND_CENTER_LATITUDE,
  },
];

const addNumberOfGeoPointInCluster = (feature: any, style: any) => {
  const clusteredFeatures = feature.get("features");
  const size = clusteredFeatures.length;
  style.getText().setText(size.toString());
};

const onGeoPointSelected = (event: any) => {
  const noPointIsSelected = () => !event.target.getFeatures().get("length");
  if (noPointIsSelected()) {
    selectedPointId.value = undefined;
    return;
  }
  event.target.getFeatures().forEach((feature: any) => {
    const features = feature.get("features");
    const singleGeoPointClicked = () => features.length === 1;
    const clusterGeoPointClicked = () => features.length > 1;

    if (singleGeoPointClicked()) {
      selectedPointId.value = features[0].values_.id;
      return;
    }
    if (clusterGeoPointClicked()) {
      const currentZoom = viewRef.value?.view.getZoom() ?? zoom.value;
      const zoomMultiplier = currentZoom < 4 ? 1.75 : 1.5;
      viewRef.value?.view.fit(feature.getGeometry(), {
        size: mapRef.value?.map.getSize(),
        maxZoom: currentZoom * zoomMultiplier,
        duration: 500,
      });
    }
  });
};

watch(selectedPointId, (_selectedPoint) => {
  if (!_selectedPoint) {
    selectInteractionsRef.value.select.getFeatures().clear();
  }
});
</script>

<template>
  <ol-map
      ref="mapRef"
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      style="width: 800px; height: 600px;"
  >
    <ol-view
        ref="viewRef"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
    />
    <ol-tile-layer>
      <ol-source-xyz url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </ol-tile-layer>
    <ol-vector-layer ref="vectorRef">
      <ol-source-cluster :distance="40">
        <ol-source-vector>
          <ol-feature
              v-for="(geoPoint, index) in geoPoints"
              :key="geoPoint.id ?? index"
              :properties="{ id: geoPoint.id ?? index }"
          >
            <ol-geom-point
                :coordinates="[geoPoint.longitude, geoPoint.latitude]"
            />
          </ol-feature>
        </ol-source-vector>
      </ol-source-cluster>
      <ol-style :overrideStyleFunction="addNumberOfGeoPointInCluster">
        <ol-style-circle :radius="15">
          <ol-style-fill color="#DF2020" />
          <ol-style-stroke color="#E48181" :width="4" />
        </ol-style-circle>
        <ol-style-text>
          <ol-style-fill color="#fff" />
        </ol-style-text>
      </ol-style>
    </ol-vector-layer>
    <ol-interaction-select
        ref="selectInteractionsRef"
        @select="onGeoPointSelected"
        :condition="selectConditions.click"
    >
      <ol-style :overrideStyleFunction="addNumberOfGeoPointInCluster">
        <ol-style-circle :radius="15">
          <ol-style-fill color="#0B378E" />
          <ol-style-stroke color="#052461" :width="4" />
        </ol-style-circle>
        <ol-style-text>
          <ol-style-fill color="#fff" />
        </ol-style-text>
      </ol-style>
    </ol-interaction-select>
    <ol-scaleline-control />
  </ol-map>
</template>

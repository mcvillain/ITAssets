<template>
  <Dashboard :uppy="uppy" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import Dashboard from '@uppy/dashboard'
import Uppy, { Meta, UploadResult } from '@uppy/core'
import Tus from '@uppy/tus'
import ScreenCapture from '@uppy/screen-capture';
import GoldenRetriever from '@uppy/golden-retriever';
import Compressor from '@uppy/compressor';

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/screen-capture/dist/style.min.css';

const props = defineProps({
  upload_guid: String
});

function uploadComplete(result: UploadResult<Meta, Record<string, never>>) {
  // handle upload complete
  console.log(result);
}

function uploadError(error: any) {
  // handle upload error
  console.log(error);
}

const uppy = new Uppy()
  .use(Dashboard, { inline: true, showProgressDetails: true, theme: 'dark', proudlyDisplayPoweredByUppy: false })
  .use(Tus, { endpoint: '/uploads/uploads', chunkSize: 1500000000 })
  .use(ScreenCapture)
  .use(GoldenRetriever)
  .use(Compressor, {quality: 0.6})
  .on('complete', uploadComplete)
  .on('error', uploadError);
uppy.info("Uploading a file with the same name as another in the case will overwrite the original.", 'info', 0);
uppy.setMeta({
  upload_guid: props.upload_guid
});
</script>

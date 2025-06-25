<script setup lang="ts">
import { AdvancedVideo  } from '@cloudinary/vue'
import { Cloudinary } from '@cloudinary/url-gen'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { format, quality } from '@cloudinary/url-gen/actions/delivery'

const props = defineProps({
    publicId: {
        type: String,
        required: true
    },
    controls: {
        type: Boolean,
        default: true
    },
    autoplay: {
        type: [Boolean,null],
        default: null
    },
    classes: {
        type: String,
        default: 'w-full h-full max-h-[80vh] object-contain object-center'
    },
})

const cld = new Cloudinary({
    cloud: {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }
})
// Use the same video for the poster, as for the video itself.

const myVideo = cld
    .video(props.publicId)
    .resize(fill().width(1440))
    .delivery(format('auto'))
    .delivery(quality('auto'));

  //  const myVideoPoster = myVideo;

// Apply the same transformation to the poster plus format JPG.
// myVideoPoster.resize(fill().width(150).height(150)) // Crop the video, focusing on the faces.  // Round the corners.
//     .format('jpg');
//const plugins = [placeholder()]
</script>

<template>
    <AdvancedVideo :cldVid="myVideo" cldPoster="auto" :controls="controls" :autoPlay="autoplay"  style="max-width: 100%" :className="classes" />
</template>
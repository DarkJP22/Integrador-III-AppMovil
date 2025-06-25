<script setup lang="ts">
import { AdvancedImage } from '@cloudinary/vue'
import { Cloudinary } from '@cloudinary/url-gen'
import { limitFill } from '@cloudinary/url-gen/actions/resize'
import { format, quality } from '@cloudinary/url-gen/actions/delivery'

const props = defineProps({
    publicId: {
        type: String,
        required: true
    }
})

const cld = new Cloudinary({
    cloud: {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }
})
const myImage = cld
    .image(props.publicId)
    .resize(limitFill().width(1440))
    .delivery(format('auto'))
    .delivery(quality('auto'))
//const plugins = [placeholder()]
</script>

<template>
    <AdvancedImage :cldImg="myImage" className="w-full h-full object-cover object-center" />
</template>
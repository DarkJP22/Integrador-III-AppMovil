import { CloudinaryResource } from '@/interfaces/cloudinary';
import axios from 'axios';

export function useCloudinary() {

    const uploadResource = async (file: File, type = 'image') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        
        try {
            const { data } = await axios.post<CloudinaryResource>(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/${type}/upload`, formData);

            return { ok: true, resource: data };

        } catch (error: any) {

            
            return { ok: false, message: error?.response?.data.error.message };
        }
    }

   


    return {
        uploadResource,
    }
} 
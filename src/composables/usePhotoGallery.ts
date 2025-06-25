import { ref, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import useUtilities from './useUtilities';
import { useGlobalSettings } from './useGlobalSettings';
import useUi from './useUi';

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
    base64Data?: string;
    blobImg?: Blob;
}

const photos = ref<UserPhoto[]>([]);
const PHOTO_STORAGE = "photos";

export default function usePhotoGallery() {
    const { alertMessage } = useUi();
    const { bytesToSize, mbToBytes } = useUtilities();
    const { maxUploadSizeInMb, limitUploadFiles } = useGlobalSettings()
    const cachePhotos = () => {
        Preferences.set({
            key: PHOTO_STORAGE,
            value: JSON.stringify(photos.value)
        });
    }
    const loadSaved = async () => {
        const photoList = await Preferences.get({ key: PHOTO_STORAGE });
        const photosInStorage = photoList.value ? JSON.parse(photoList.value) : [];

        for (const photo of photosInStorage) {
            const file = await Filesystem.readFile({
                path: photo.filepath,
                directory: Directory.Data
            });
            photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        }

        photos.value = photosInStorage;
    }
    const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

    const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
        let base64Data: string | Blob;
        let blobImg: Blob;
        // "hybrid" will detect mobile - iOS or Android
        if (isPlatform('hybrid')) {
            const file = await Filesystem.readFile({
                path: photo.path ?? ''
            });
            base64Data = file.data;
            const response = await fetch(photo.webPath ?? '');
            const blob = await response.blob();
            blobImg = blob;

        } else {
            // Fetch the photo, read as a blob, then convert to base64 format
            const response = await fetch(photo.webPath ?? '');
            const blob = await response.blob();
            blobImg = blob;
            base64Data = await convertBlobToBase64(blob) as string;
        }
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data
        });

        if (isPlatform('hybrid')) {
            // Display the new image by rewriting the 'file://' path to HTTP
            // Details: https://ionicframework.com/docs/building/webview#file-protocol
            return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
                blobImg: blobImg
            };
        }
        else {
            // Use webPath to display the new image instead of base64 since it's
            // already loaded into memory
            return {
                filepath: fileName,
                webviewPath: photo.webPath,
                blobImg: blobImg
            };
        }
    }
    const takePhoto = async () => {
        const cameraPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 60
        });
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(cameraPhoto, fileName);

        const maxSizeInBytes = mbToBytes(maxUploadSizeInMb.value);


        if (savedFileImage.blobImg && savedFileImage.blobImg?.size > maxSizeInBytes) { // 10mb
            alertMessage('Error', 'El tamaño del archivo es demasiado grande. El tamaño máximo del archivo es ' + bytesToSize(maxSizeInBytes));
            return
        }


        if (limitUploadFiles.value && photos.value.length >= limitUploadFiles.value) { // 10mb
            alertMessage('Error', 'Ha alcanzado el límite de archivos permitidos ' + limitUploadFiles.value);
            return
        }

        photos.value = [savedFileImage, ...photos.value];
      
    };

    watch(photos, cachePhotos);

    return {
        photos,
        loadSaved,
        takePhoto
    };
}
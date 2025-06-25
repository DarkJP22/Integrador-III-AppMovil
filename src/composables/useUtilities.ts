import { format, parseISO, formatISO, toDate, getTime, eachDayOfInterval } from 'date-fns';
import { ref } from 'vue';
import haciendaApi from '@/services/haciendaApi';
import { Browser } from '@capacitor/browser';
import { es } from 'date-fns/locale';

export default function () {
  const supportLink = 'https://doctorbluecr.com/soporte';
  const isLoading = ref(false);

  const parseDatetime = (date: any) => {
    if (!date) return '';
    return format(parseISO(date), 'yyyy-MM-dd hh:mm a');
  };

  const parseIsoDatetime = (date: any) => {
    if (!date) return '';
    return formatISO(parseISO(date));
  };

  const parseIsoDatetimeWithoutTz = (date: any, seconds = true) => {
    if (!date) return '';
    return format(parseISO(date), seconds ? "yyyy-MM-dd'T'HH:mm:00" : "yyyy-MM-dd'T'HH:mm");
  };

  const parseDate = (date: any) => {
    if (!date) return '';
    return format(parseISO(date), 'yyyy-MM-dd');
  };
  const parseDateHuman = (date: any) => {
    if (!date) return '';
    return format(parseISO(date), 'PPPP', { locale: es });
  };

  const parseTime12 = (date: any) => {
    if (!date) return '';
    return format(parseISO(date), 'hh:mm:00 a');
  };
  const parseTime24 = (date: any, seconds = true) => {
    if (!date) return '';
    return format(parseISO(date), seconds ? 'HH:mm:00' : 'HH:mm');
  };

  const today = (date?:any) =>{
    if(!date) return format(new Date(), 'yyyy-MM-dd');
    return format(parseISO(date), 'yyyy-MM-dd');
};

  const convertEmbedUrl = (input: string) => {
    const patternYoutube = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(\S+)/g;
    const patternVimeo = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(\S+)/g;
    const patternVideo = /([-a-zA-Z0-9@:%_.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_.~#?&//=]*)?(?:webm|mp4|ogv))/gi;

    let result = '';

    if (patternYoutube.test(input)) {
      const replacement = '<iframe style="width:100%;" width="100%" height="345" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>';
      const tempInput = input.replace(patternYoutube, replacement);
      // For start time, turn get param & into ?
      result = tempInput.replace('&amp;t=', '?t=');
    }
    if (patternVimeo.test(input)) {
      const replacement = '<iframe style="width:100%;" width="420" height="345" src="https://player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
      result = input.replace(patternVimeo, replacement);
    }
    if (patternVideo.test(input)) {
      const replacement = '<video style="width:100%;" controls="" loop="" controls src="$1" style="max-width: 960px; max-height: 676px;"></video>';
      result = input.replace(patternVideo, replacement);
    }

    return result;
  }

  const getCedulaInformation = async (q: string) => {

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await haciendaApi.get('/fe/ae?identificacion=' + q);

      isLoading.value = false

      return data;


    } catch (error) {
      isLoading.value = false
      return {}

    }
  }

  const moneyFormat = (value: any, currency?: any) => {
    if (value === null || value === undefined) return;

    if (!currency) {
      currency = {
        precision: 2,
        thousand_separator: ',',
        decimal_separator: '.',
        symbol: '₡',
        code: 'CRC'
      };
    }

    if (typeof currency === 'string') {
        currency = {
          precision: 2,
          thousand_separator: ',',
          decimal_separator: '.',
          symbol: '₡',
          code: currency
        };
    }
    
    const {
      precision,
      //symbol,
      code
    } = currency;

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,

      // These options are needed to round to whole numbers if that's what you want.
      minimumFractionDigits: precision, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      maximumFractionDigits: precision, // (causes 2500.99 to be printed as $2,501)
    });

    if (typeof value === 'string') {

      value = parseFloat(value);
    }

    return formatter.format(value);


  };

  const doubleZeros = (item: number) => {

    return (item < 10) ? '0' + item : item;
  }

  const createIntervalsFromHours = (date: string, fromHour: string, untilHour: string, slot: number) => {

    const until = getTime(parseISO(date + ' ' + untilHour)); // Date.parse(date + " " + until);
    const from = getTime(parseISO(date + ' ' + fromHour)); // Date.parse(date + " " + from);
    

    const intervalLength = (slot) ? slot : 30;
    const intervalsPerHour = 60 / intervalLength;
    const milisecsPerHour = 60 * 60 * 1000;

    const max = (Math.abs(until - from) / milisecsPerHour) * intervalsPerHour;

    const time = toDate(parseISO(date + ' ' + fromHour));//from;//new Date(from);
    const intervals = [];
    for (let i = 0; i <= max; i++) {
      //doubleZeros just adds a zero in front of the value if it's smaller than 10.
      intervals.push(doubleZeros(time.getHours()) + ":" + doubleZeros(time.getMinutes()));
      time.setMinutes(time.getMinutes() + intervalLength);
    }


    return intervals;
  }

  const createIntervalsDates = (from: string, to: string) => {
    const result = eachDayOfInterval({
      start: parseISO(from),
      end: parseISO(to)
    })

    return result.map(date => format(date, 'yyyy-MM-dd'));

  }

  const toFormData = (object: any) => {
    const formData = new FormData()

    Object.keys(object).forEach((key) => {
      if (Array.isArray(object[key])) {
        formData.append(key, JSON.stringify(object[key]))
      } else {
        // Convert null to empty strings (because formData does not support null values and converts it to string)
        if (object[key] === null) {
          object[key] = ''
        }

        formData.append(key, object[key])
      }
    })

    return formData
  };

  const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  const openFile = async (url: string) => {
    await Browser.open({ url: url });
  }

  function bytesToSize(bytes: any, decimals = 2) {
    if (!Number(bytes)) {
      return '0 Bytes';
    }

    const kbToBytes = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
      'Bytes',
      'KiB',
      'MiB',
      'GiB',
      'TiB',
      'PiB',
      'EiB',
      'ZiB',
      'YiB',
    ];

    const index = Math.floor(
      Math.log(bytes) / Math.log(kbToBytes),
    );

    return `${parseFloat(
      (bytes / Math.pow(kbToBytes, index)).toFixed(dm),
    )} ${sizes[index]}`;
  }

  function mbToBytes(mb: any) {
    return parseFloat(mb) * 1024 * 1024
  }



  return {
    today,
    parseDatetime,
    parseDate,
    parseDateHuman,
    parseTime12,
    parseTime24,
    parseIsoDatetime,
    parseIsoDatetimeWithoutTz,
    convertEmbedUrl,
    getCedulaInformation,
    moneyFormat,
    createIntervalsFromHours,
    createIntervalsDates,
    toFormData,
    supportLink,
    convertBlobToBase64,
    openFile,
    mbToBytes,
    bytesToSize

  }

}
export interface Patient {
    id:                  number;
    tipo_identificacion: string;
    ide:                 string;
    first_name:          string;
    last_name:           null | string;
    birth_date:          Date;
    gender:              string;
    phone_number:        string;
    phone_country_code:  string;
    email:               string;
    address:             string;
    province:            string;
    city:                string;
    avatar_path:         string;
    conditions:          string[];
    created_by:          number;
    created_at:          Date;
    updated_at:          Date;
    fullname:            string;
    fullPhone:           string;
    age:                 string;
    pivot?:               Pivot;
    unread_labresults_count?:number;
    complete_information: boolean
}
interface Pivot {
    user_id:    number;
    patient_id: number;
}

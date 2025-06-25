export interface SocialStories {
    data: Story[];
}

export interface Story {
    time_ago:   string;
    id:         number;
    user_id:    number;
    public_id:  string;
    url:        string;
    type:       string;
    duration:   number;
    format:     string;
    likes:      number;
    views:      number;
    viewed?: boolean;
    created_at: Date;
}


// export interface Story {
//     id: string;
//     imageUrl: string;
//     timestamp: number;
//     viewed?: boolean;
//   }
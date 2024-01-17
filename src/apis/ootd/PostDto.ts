export interface PostPageAdminResponse<T extends PostAdminResponse> {
    totalPages: number;
    totalElements: number;
    posts: Array<T>;
}

export interface PostAdminResponse {
    id: number;
    thumbnailImgUrl: string;
    hashTagNames: Array<string>;
    title: string;
    description: string;
    memberNickname: string;
}
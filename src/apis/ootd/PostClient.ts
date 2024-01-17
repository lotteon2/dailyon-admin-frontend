import {authAxiosInstance} from "@/apis/utils";
import type {PostAdminResponse, PostPageAdminResponse} from "@/apis/ootd/PostDto";
import type {AxiosResponse} from 'axios'

const SNS_SERVICE_PREFIX: string = "/sns-service"
const SNS_ADMIN_PREFIX: string = "/admin"

export const getPosts = async (page: number, size: number, sort: string): Promise<PostPageAdminResponse<PostAdminResponse>> => {
    const response: AxiosResponse = await authAxiosInstance.get(
        `${SNS_SERVICE_PREFIX}${SNS_ADMIN_PREFIX}/posts`,
        {
            params: {
                page: page,
                size: size,
                sort: sort
            }
        }
    );
    return response.data
}

export const softBulkDeletePosts = async (postIds: Array<number>): Promise<void> => {
    await authAxiosInstance.delete(`${SNS_SERVICE_PREFIX}${SNS_ADMIN_PREFIX}/posts`, {
        params: {
            postIds: postIds.join(',')
        }
    })
}
import axios from "axios";

export const githubApi = axios.create({
    baseURL: 'https://api.github.com/repos/facebook/react',
    headers: {
        Authorization: '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'
    }

})
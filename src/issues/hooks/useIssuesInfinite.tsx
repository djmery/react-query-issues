import { dataTagSymbol, useInfiniteQuery } from "@tanstack/react-query"
import { Issue, State } from "../../interfaces";
import { sleep } from "../../helpers";
import { githubApi } from "../../api/githubApi";

interface Props {
    state?: State;
    labels: String[];
    page?: number;
}

interface queryProps {
    pageParam?: number;
    queryKey: (string | Props)[];
}

const getIssues = async ({ pageParam = 1, queryKey }: queryProps): Promise<Issue[]> => {

    const [, , args] = queryKey;
    const { state, labels } = args as Props;

    await sleep(2);

    const params = new URLSearchParams();
    if (state) params.append('state', state);

    if (labels.length > 0) {
        const labelString = labels.join(',');
        params.append('labels', labelString);
    }

    params.append('page', pageParam.toString());
    params.append('per_page', '5');

    const { data } = await githubApi.get<Issue[]>('/issues', { params });
    //console.log(data);
    return data;
}


export const useIssuesInfinite = ({ state, labels, page }: Props) => {

    const issuesQuery = useInfiniteQuery({
        queryKey: ['issues', 'infinite', { state, labels, page }], // reactquery va a saber cuando el state cambia
        queryFn: (data) => getIssues(data),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length === 0) return
            return pages.length + 1;
        }

    })



    return {
        issuesQuery
    }
}

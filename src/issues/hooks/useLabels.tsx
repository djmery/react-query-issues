import { useQuery } from "@tanstack/react-query";
import { githubApi } from '../../api/githubApi';
import { Label } from "../../interfaces/label";
import { sleep } from "../../helpers/sleep";


const getLabels = async (): Promise<Label[]> => {
    await sleep(2);
    const { data } = await githubApi.get<Label[]>('/labels?per_page=100');
    //console.log(data);
    return data;
}

export const useLabels = () => {

    const labelsQuery = useQuery({
        queryKey: ['labels'],
        queryFn: getLabels,
        staleTime: 1000 * 60 * 60,
        //initialData: [],
        placeholderData: [
            {
                id: 1155972012,
                node_id: 'MDU6TGFiZWwxMTU1OTcyMDEy',
                url: 'https://api.github.com/repos/facebook/react/labels/Component:%20Scheduler',
                name: 'Component: Scheduler',
                color: '9de8f9',
                default: false,
            },
            {
                id: 717031390,
                node_id: 'MDU6TGFiZWw3MTcwMzEzOTA',
                url: 'https://api.github.com/repos/facebook/react/labels/good%20first%20issue',
                name: 'good first issue',
                color: '6ce26a',
                default: true
            }
        ]
    });

    return {
        labelsQuery
    }
}

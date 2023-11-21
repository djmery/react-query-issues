import { useQuery } from "@tanstack/react-query";
import { Issue } from '../../interfaces';
import { githubApi } from "../../api/githubApi";
import { sleep } from "../../helpers/sleep";

export const getIssueInfo = async (issueNumber: number): Promise<Issue> => {
    await sleep(2);
    const { data } = await githubApi.get<Issue>(`/issues/${issueNumber}`);
    console.log(data);
    return data;

}
export const getIssueComments = async (issueNumber: number): Promise<Issue[]> => {
    await sleep(2);
    const { data } = await githubApi.get<Issue[]>(`/issues/${issueNumber}/comments`);
    //console.log(data);
    return data;

}

export const useIssue = (issueNumber: number) => {

    const issueQuery = useQuery({
        queryKey: ['issue', issueNumber],
        queryFn: () => getIssueInfo(issueNumber)
    });
    const commentsQuery = useQuery({
        queryKey: ['issue', issueNumber, 'comments'],
        queryFn: () => getIssueComments(issueQuery.data!.number),
        //solo nos muestra el primer comentario al poner el enabled en false, en cuanto pase a true, es cuando realiza la petición
        //enabled: false
        enabled: issueQuery.data !== undefined,

    });

    return {
        issueQuery,
        commentsQuery
    }
}

import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FiInfo, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';

import { Issue, State } from '../../interfaces';
import { getIssueComments, getIssueInfo } from '../hooks/useIssue';
import { timeSince } from '../../helpers';

interface Props {
    issue: Issue
}

export const IssueItem: FC<Props> = ({ issue }) => {

    const navigate = useNavigate();
    //en el queryClient tengo información para poder limpiarlo, para invalidar queries, para obtener todos los queries, saber si estoy haciendo algún tipo de mutación
    const queryClient = useQueryClient();

    const prefetchData = () => {
        queryClient.prefetchQuery({
            queryKey: ['issue', issue.number],
            queryFn: () => getIssueInfo(issue.number)
        })

        queryClient.prefetchQuery({
            queryKey: ['issue', issue.number, 'comments'],
            queryFn: () => getIssueComments(issue.number)
        })

    }

    const preSetData = () => {
        // es lo mismo que en la anterior pero en lugar de mandar una función, voy a mandar la data que quiero que
        //sea almacenada en el cache el issue nada mas
        queryClient.setQueryData(['issue', issue.number],
            issue,
            {
                updatedAt: new Date().getTime() + 100000
            }
        )
    }

    return (
        <div className="card mb-2 issue"
            onClick={() => navigate(`/issues/issue/${issue.number}`)}
            //para poder acceder a estas peticiones necesitamos el acceso al queryClient que lo definimos en el main
            // la gente de react query creo un custom hook que nos regresa el queryClient
            //onMouseEnter={prefetchData}
            onMouseEnter={preSetData}

        >
            <div className="card-body d-flex align-items-center">
                {
                    issue.state === State.Open
                        ? (<FiInfo size={30} color="red" />)
                        : (<FiCheckCircle size={30} color="green" />)
                }

                <div className="d-flex flex-column flex-fill px-2">
                    <span>{issue.title}</span>
                    <span className="issue-subinfo">#{issue.number} opened {(issue.created_at).toString()} ago by <span className='fw-bold'>{issue.user.login}</span></span>
                    <div>
                        {
                            issue.labels.map(label => (
                                <span
                                    key={label.id}
                                    className='badge rounded-pill m-1'
                                    style={{ backgroundColor: `#${label.color}`, color: 'black' }}
                                >
                                    {label.name}
                                </span>
                            ))
                        }
                    </div>
                </div>

                <div className='d-flex align-items-center'>
                    <img src={issue.user.avatar_url} alt="User Avatar" className="avatar" />
                    <span className='px-2'>{issue.comments}</span>
                    <FiMessageSquare />
                </div>

            </div>
        </div>
    )
}

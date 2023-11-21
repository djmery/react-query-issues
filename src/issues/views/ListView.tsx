import { useState } from 'react';
import { IssueList } from '../components/IssueList';
import { LabelPicker } from '../components/LabelPicker';
import { useIssues } from '../hooks';
import { LoadingIcons } from '../../shared/components/LoadingIcons';
import { State } from '../../interfaces';


export const ListView = () => {

  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [state, setState] = useState<State>();

  const { issuesQuery, page, nextPage, prevPage } = useIssues({ state, labels: selectedLabels });

  const onLabelChanged = (labelName: string) => {
    (selectedLabels.includes(labelName))
      ? setSelectedLabels(selectedLabels.filter(label => label !== labelName))
      : setSelectedLabels([...selectedLabels, labelName]);

    console.log(selectedLabels);
  }


  return (
    <div className="row mt-5">

      <div className="col-8">
        {
          issuesQuery.isLoading
            ? (<LoadingIcons />)
            : (
              <IssueList
                issues={issuesQuery.data || []}
                state={state}
                onStateChanged={(newState) => setState(newState)}
              />)
        }

        <div className='d-flex justify-content-between align-items-center mt-2'>
          <button
            className='btn btn-outline-primary'
            disabled={issuesQuery.isFetching}
            onClick={prevPage}
          >Prev</button>
          <span>{page}</span>
          <button
            className='btn btn-outline-primary'
            disabled={issuesQuery.isFetching}
            onClick={nextPage}
          >Next</button>
        </div>

      </div>

      <div className="col-4">
        <LabelPicker
          selectedLabels={selectedLabels}
          onChange={(labelName) => onLabelChanged(labelName)}
        />
      </div>
    </div>
  )
}

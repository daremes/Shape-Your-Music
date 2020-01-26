import React, { useContext } from 'react';
import { withRouter } from 'react-router';
import { useMutation } from '@apollo/react-hooks';

import { DEFAULT_PROJECT, getProjectSaveData } from 'utils/project';
import { CurrentUserContext } from 'context/CurrentUserContext/CurrentUserContextProvider';

import {
  showLoadingMessage,
  showErrorMessage,
  showSuccessMessage,
} from 'utils/message';
import AudioManager from './AudioManager';
import ProjectContainer from './Container';
import { CREATE_PROJECT } from 'graphql/mutations';
import { GET_ALL_PROJECTS } from 'graphql/queries';

function ProjectCreate(props) {
  const { user: currentUser, authenticate } = useContext(CurrentUserContext);
  const { history } = props;

  const [createProjectMutation] = useMutation(CREATE_PROJECT, {
    refetchQueries: () => [{ query: GET_ALL_PROJECTS }],
    onError: showErrorMessage,
    onCompleted: ({ createProject }) => {
      const { _id, name } = createProject;
      showSuccessMessage(`Saved "${name}"`);
      /* TODO: fix bug where reloading the page loads from older project state */
      history.push({
        pathname: `/project/${_id}`,
        state: { projectData: createProject },
      });
    },
  });

  const saveProject = project => {
    /* TODO: Automatically save on user login success */
    if (!currentUser) {
      authenticate();
      return;
    }

    showLoadingMessage('Saving...');
    const projectSaveData = getProjectSaveData(project);
    createProjectMutation({
      variables: {
        data: projectSaveData,
      },
    });
  };

  const projectProps = {
    initState: DEFAULT_PROJECT,
    saveProject,
    showSaveButton: true,
    projectAuthor: '',
  };

  return (
    <AudioManager>
      {audioProps => <ProjectContainer {...projectProps} {...audioProps} />}
    </AudioManager>
  );
}

export default withRouter(ProjectCreate);

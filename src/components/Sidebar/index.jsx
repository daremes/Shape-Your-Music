import React, { useState } from 'react';
import { Badge, Icon, Drawer, Tooltip, Button, Popconfirm } from 'antd';

import Downloads from 'components/Downloads';
import SaveButton from 'components/Toolbar/SaveButton';
import styles from './styles.module.css';
import { useProjectContext } from 'context/useProjectContext';

function Sidebar(props) {
  const { showSaveButton, showSettingsButton } = props;

  const [seenDownloadCount, setSeenDownloadCount] = useState(0);
  const [isDownloadsDrawerVisible, setIsDownloadsDrawerVisible] = useState(
    false
  );
  const [isSettingsDrawerVisible, setIsSettingsDrawerVisible] = useState(false);

  const {
    downloadUrls,
    projectName,
    imperativeHandlers: { exportProjectToMIDI, saveProject, deleteProject },
  } = useProjectContext();

  const count = downloadUrls.length - seenDownloadCount;

  return (
    <div className={styles.sidebar}>
      <div className={styles.tabs}>
        {showSaveButton && (
          <Tooltip placement="right" title="Save Project">
            <div className={styles.tabButton}>
              <SaveButton
                onConfirm={name => saveProject(name)}
                projectName={projectName}
              />
            </div>
          </Tooltip>
        )}
        <Badge style={{ fontWeight: 'bold' }} count={count} offset={[-2, 2]}>
          <Tooltip placement="right" title="Downloads">
            <div
              className={styles.tabButton}
              onClick={() => {
                setSeenDownloadCount(downloadUrls.length);
                setIsDownloadsDrawerVisible(true);
              }}
            >
              <Icon type="download" />
            </div>
          </Tooltip>
        </Badge>
        <Tooltip placement="right" title="Export to MIDI">
          <div className={styles.tabButton} onClick={exportProjectToMIDI}>
            <Icon type="export" />
          </div>
        </Tooltip>
        {showSettingsButton && (
          <Tooltip placement="right" title="Settings">
            <div
              className={styles.tabButton}
              onClick={() => {
                setIsSettingsDrawerVisible(true);
              }}
            >
              <Icon type="setting" />
            </div>
          </Tooltip>
        )}
      </div>
      {/* TODO: combine drawers? */}
      <Drawer
        title="Downloads"
        placement="left"
        width={400}
        onClose={() => setIsDownloadsDrawerVisible(false)}
        visible={isDownloadsDrawerVisible}
      >
        <Downloads downloadUrls={downloadUrls} />
      </Drawer>
      {showSettingsButton && (
        <Drawer
          title="Settings"
          placement="left"
          width={400}
          onClose={() => setIsSettingsDrawerVisible(false)}
          visible={isSettingsDrawerVisible}
        >
          <Popconfirm
            title={`Delete "${projectName}"? This action cannot be undone.`}
            placement="rightTop"
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
            onConfirm={deleteProject}
            icon={<Icon type="question-circle-o" />}
          >
            <Button style={{ fontWeight: 'bold' }} type="danger">
              Delete Project
            </Button>
          </Popconfirm>
        </Drawer>
      )}
    </div>
  );
}

export default Sidebar;

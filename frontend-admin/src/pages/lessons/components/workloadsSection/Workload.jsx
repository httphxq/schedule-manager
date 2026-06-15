import { render } from '../../../../core/render';
import { refreshPage } from '../../../../core/router';
import { deleteWorkload } from '../../../../api/workloads';
import { ui } from '../../../../utils/dom';
import InfoSection from '../InfoSection';
import styles from './Workload.module.css'
import lessonsState from '../../../../state/lessonsState';

export default function Workload({ workload }) {
  const handleDeleteWorkload = async () => {
    const result = await deleteWorkload(workload.workloadId)
    ui.showFlashMessage(result)
    refreshPage()
  }
  
  const handleContextMenu = (e) => {
    ui.showCustomMenu(e.clientX, e.clientY, [
      {
        label: 'Удалить',
        variant: 'danger',
        onClick: handleDeleteWorkload,
      },
    ])
  }
  const unselectWorkload = () => {
    lessonsState.clearCursorStatus()
    refreshPage()
  }

  const selectWorkload = () => {
    lessonsState.setSelectedGroupId(workload.groupId)
    lessonsState.setSelectedWorkloadId(workload.workloadId)
    lessonsState.setSelectedWorkload(workload)
    lessonsState.setCursorStatus('workloadSelected')
    console.log(33, lessonsState);
    refreshPage()
  }

  const handleWorkloadClick = () => {
    lessonsState.getCursorStatus() !== 'workloadSelected' 
      ? selectWorkload()
      : unselectWorkload()
  }

  const onMouseEnter = () => {
    render("#infoSection", <InfoSection scheduleItem={workload} />)
  }
  const onMouseLeave = () => {
    render("#infoSection", <InfoSection />)
  }

  return (
    <div class={lessonsState.getSelectedWorkloadId() === workload.workloadId ? `${styles.workload} ${styles.active}` : `${styles.workload}` } onMouseEnter = { onMouseEnter }
  onMouseLeave = { onMouseLeave } onClick = { handleWorkloadClick } onContextMenu = { handleContextMenu } >
      <div class={styles.subjectName}>{workload.subjectAbbr}</div>
      <div class={styles.divider}></div>
      <div class={styles.workloadsCount}>{workload.lessonsPerWeek}</div>
    </div >
  )
}

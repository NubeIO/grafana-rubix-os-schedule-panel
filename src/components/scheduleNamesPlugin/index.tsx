import React, { useReducer, useState, useEffect } from 'react';
import { Input, Button } from '@grafana/ui';
import * as schedulePluginActions from './scheduleNamesPlugin.actions';
import { scheduleNameReducer } from './scheduleNamesPlugin.reducer';
import './scheduleNamesPlugin.css';

const CustomInput = (props: any) => {
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && typeof props.onEnter === 'function') {
      props.onEnter(event);
    }
  };

  return <Input type="text" {...props} onKeyDown={handleKeyDown} />;
};

function ScheduleNamesPanelPlugin(props: any) {
  const [state, dispatch] = useReducer(scheduleNameReducer, props.value);
  const [scheduleName, updateScheduleName] = useState('');

  useEffect(() => {
    props.onChange(state);
  }, [state]);

  const createScheduleName = () => {
    if (!scheduleName) {
      return;
    }
    dispatch(schedulePluginActions.createScheduleName(scheduleName));
    updateScheduleName('');
  };

  const changeScheduleName = (id: string, name: string) => {
    dispatch(schedulePluginActions.updateScheduleName({ id, name }));
  };

  const deleteScheduleName = (id: string) => {
    dispatch(schedulePluginActions.deleteScheduleName(id));
  };

  return (
    <div>
      <CreateScheduleName value={scheduleName} updateValue={updateScheduleName} onButtonClick={createScheduleName} />
      {state && state.scheduleNameIds && state.scheduleNameIds.length > 0 && (
        <ul className="schedule-names-plugin">
          <li className="header">
            <span className="flex-1">S/N</span>
            <span className="flex-4 item-name">Name</span>
            <span className="flex-2">Actions</span>
          </li>
          <div className="list-items-container">
            {state.scheduleNameIds.map((id: any, index: number) => (
              <ScheduleNameListItem
                key={id}
                index={index}
                scheduleName={state.scheduleNames[id]}
                deleteScheduleName={deleteScheduleName}
                updateScheduleName={changeScheduleName}
              />
            ))}
          </div>
        </ul>
      )}
    </div>
  );
}

function CreateScheduleName(props: any) {
  const { value, updateValue, onButtonClick, onCancel, isUpdate = false } = props;
  return (
    <div style={{ display: 'flex' }}>
      <CustomInput
        type="text"
        value={value}
        onEnter={onButtonClick}
        onChange={(e: any) => updateValue(e.target.value)}
      />
      <Button size="md" icon={!isUpdate ? 'plus' : 'check'} onClick={onButtonClick} disabled={!value} />
      {isUpdate && <Button onClick={onCancel} size="md" icon="times" variant="link" />}
    </div>
  );
}

function ScheduleNameListItem(props: any) {
  const { scheduleName, index, deleteScheduleName, updateScheduleName } = props;
  const [isEdit, updateIsEdit] = useState(false);
  const [value, updateValue] = useState(scheduleName.name);

  if (!isEdit) {
    return (
      <li>
        <span className="flex-1">{index + 1}</span>
        <span className="flex-4 item-name" title={scheduleName.name}>
          {scheduleName.name}
        </span>
        <span className="flex flex-2 justify-end">
          <Button variant="primary" size="md" icon="edit" onClick={() => updateIsEdit(true)} />
          <Button size="md" variant="destructive" icon="times" onClick={() => deleteScheduleName(scheduleName.id)} />
        </span>
      </li>
    );
  }

  return (
    <CreateScheduleName
      isUpdate={isEdit}
      onCancel={() => {
        updateIsEdit(false);
      }}
      value={value}
      updateValue={updateValue}
      onButtonClick={() => {
        updateScheduleName(scheduleName.id, value);
        updateIsEdit(false);
      }}
    />
  );
}

export default ScheduleNamesPanelPlugin;

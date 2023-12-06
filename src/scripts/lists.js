import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import { List, ListItem } from 'material-ui/List';
import MobileTearSheet from './MobileTearSheet';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

const propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
  updateTask: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  removeMode: PropTypes.bool,
  darkMode: PropTypes.bool,
};

const defaultProps = {
  items: [],
  removeMode: false,
  darkMode: false,
};
const Lists = (props) => {
  const { darkMode } = props;

  const handleCheckboxClick = (event) => {
    event.target.style.backgroundColor = '#f19066';
  };

  const checkboxStyle = {
    color: darkMode ? '#000' : '', 
    '& input': {
      
      onClick: handleCheckboxClick, 
      border: '1px solid transparent', 
    },
    '& svg': {
      
      fill: darkMode ? '#d9534f !important' : '#d9534f', 
    },
  };


  return (
    <div className={`app-task-lists ${darkMode ? 'dark-mode' : ''}`}>
      <MobileTearSheet style={{ padding: 10 }}>
        <List className="list-items">
          {props.items.map(item => (
            <ListItem
              key={item.id + item.title}
              onClick={() => (props.removeMode ? props.removeTask(item) : props.updateTask(item))}
              className={`task-animation-${props.removeMode ? 'leave' : 'enter'}`}
              rightIcon={props.removeMode ? <DeleteIcon /> : <DeleteIcon style={{ visibility: 'hidden' }} />}
            >
              <Checkbox
                label={item.title}
                disabled={props.removeMode}
                checked={item.status === 'Done'}
                className={`${item.status === 'Done' ? 'task-done' : ''}`}
                style={checkboxStyle}
              />
            </ListItem>
          ))}
        </List>
      </MobileTearSheet>
    </div>
  );
};
Lists.propTypes = propTypes;
Lists.defaultProps = defaultProps;

export default Lists;

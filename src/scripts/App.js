import React, { Component } from 'react';
import sortBy from 'sort-by';
import { CSSTransitionGroup } from 'react-transition-group';
import SwipeableViews from 'react-swipeable-views';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import ListIcon from 'material-ui/svg-icons/action/list';
import Brightness4Icon from 'material-ui/svg-icons/image/brightness-4';
import TodoIcon from 'material-ui/svg-icons/action/today';
import EditIcon from 'material-ui/svg-icons/action/delete';
import CloseIcon from 'material-ui/svg-icons/content/delete-sweep';
import Lists from './lists';
import ConfirmDialog from './ConfirmDialog';
import If from './If';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      taskIdCounter: 0,
      submitDisabled: true,
      slideIndex: 0,
      dialogOpen: false,
      removeMode: false,
      darkMode: true,
    };


    this.toggleDarkMode = this.toggleDarkMode.bind(this);
  }

componentWillMount() {
  const toDoListItems = window.localStorage.getItem('toDoListItems') || '[]';
  const taskIdCounter = window.localStorage.getItem('taskIdCounter') || 0;

  this.setState({
    items: JSON.parse(toDoListItems),
    taskIdCounter: taskIdCounter,
  });
}

addTask = () => {
  const input = this.taskInput.input || {};
  const { value = '' } = input;

  if (value === '') return;

  this.setState(previousState => {
    const { items = [] } = previousState;
    const { taskIdCounter = 0 } = previousState;
    const taskId = taskIdCounter + 1;
    const newTask = {
      id: taskId,
      title: value,
      status: 'To Do',
    };
    items.push(newTask);
    return {
      items: items.sort(sortBy('id')),
      submitDisabled: true,
      taskIdCounter: taskId,
    };
  }, () => {
    this.taskInput.input.value = '';
    this.updateLocalStorageItems(this.state.items);
    this.updateTaskCounter(this.state.taskIdCounter);
  });
};

handleUpdateTask = (task) => {
  this.setState(previousState => {
    const { items } = previousState;
    const filteredItems = items.filter(item => item.id !== task.id);
    task.status = task.status === 'To Do' ? 'Done' : 'To Do';
    filteredItems.push(task);
    return {
      items: filteredItems.sort(sortBy('id')),
    };
  }, () => {
    this.updateLocalStorageItems(this.state.items);
  });
};

handleRemoveTask = (task) => {
  this.setState(previousState => {
    const { items } = previousState;
    const filteredItems = items.filter(item => item.id !== task.id);
    return {
      items: filteredItems.sort(sortBy('id')),
    };
  }, () => {
    this.updateLocalStorageItems(this.state.items);
  });
};

handleTextFieldChange = (event, value) => {
  if ((value.length > 0) && this.state.submitDisabled) {
    this.setState({ submitDisabled: false });
  } else if ((value.length === 0) && !this.state.submitDisabled) {
    this.setState({ submitDisabled: true });
  }
};

updateLocalStorageItems = (items) => {
  window.localStorage.setItem('toDoListItems', JSON.stringify(items));
};

updateTaskCounter = (taskCounter) => {
  window.localStorage.setItem('taskIdCounter', taskCounter);
};

handleChange = (value) => {
  this.setState({
    slideIndex: value,
  }, () => {
    window.scrollTo(0, 0);
  });
};

enableRemoveMode = () => {
  if (!this.state.removeMode) {
    this.setState({ removeMode: true });
  }
};

disableRemoveMode = () => {
  if (this.state.removeMode) {
    this.setState({ removeMode: false });
  }
};
clearTasks = () => {
  this.setState({ removeMode: false, items: [] }, () => {
    this.updateLocalStorageItems(this.state.items);
    this.handleDialogClose();
  });
};

handleDialogOpen = () => {
  this.setState({ dialogOpen: true });
};

handleDialogClose = () => {
  this.setState({ dialogOpen: false });
};

keyPress = (e) => {
  if (e.keyCode === 13) {
    this.addTask();
  }
};
toggleDarkMode = () => {
  this.setState((prevState) => {
    console.log('Updated state:', { darkMode: !prevState.darkMode });
    return { darkMode: !prevState.darkMode };
  });
};
render() {
  const { items = [], darkMode } = this.state;

  const theme = getMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary1Color: darkMode ? '#800000' : '#b36679', 
      accent1Color: darkMode ? '#3C0008' : '#800000', 
      textColor: darkMode ? '#fff' : '#000', 
      canvasColor: darkMode ? '#260000' : '#a64d4d', 
      borderColor: darkMode ? '#3C0008' : '#800000', 
    },
  });

  const columns = [
    { title: 'To Do', items: items.filter(item => item.status === 'To Do'), icon: <TodoIcon /> },
    { title: 'Done', items: items.filter(item => item.status === 'Done'), icon: <CheckIcon /> },
    { title: 'All', items, icon: <ListIcon /> },
  ];

  const appStyles = {
    backgroundColor: darkMode ? '#260000' : '#a64d4d', 
    color: darkMode ? '#a64d4d !important' : '#260000',
  };

  const bodyStyles = {
    backgroundColor: darkMode ? '#260000' : '#a64d4d', 
  };

  document.body.style.backgroundColor = bodyStyles.backgroundColor;

  return (
    <MuiThemeProvider muiTheme={theme}>
      <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`} style={appStyles}>
        <ConfirmDialog
          title="Clear All Tasks"
          message={'Are you sure you want to remove all tasks from the App?'}
          onCancel={this.handleDialogClose}
          onConfirm={this.clearTasks}
          open={this.state.dialogOpen}
        />
        <AppBar
          title={<span style={{ color: darkMode ? '#fff' : '#000', flex: 1, textAlign: 'center' }}>To-Do List</span>}
          showMenuIconButton={false}
          style={{
            backgroundColor: darkMode ? '#3C1414' : '#b36679', 
            position: 'relative',
            zIndex: 9999,
          }}
        />
        <div className="App-container">
          <div className="tasks-and-tabs">
            <div className="task-input-container">
              <TextField
                hintText="Type task"
                floatingLabelText="Add Task"
                ref={(taskInput) => {
                  this.taskInput = taskInput;
                }}
                disabled={this.state.removeMode}
                onChange={this.handleTextFieldChange}
                onKeyDown={this.keyPress}
              />
    <RaisedButton
  label="Create"
  onClick={this.addTask}
  disabled={this.state.submitDisabled}
  style={{
    backgroundColor: darkMode ? '#8B4513' : this.props.muiTheme.palette.primary1Color,
    color: darkMode ? '#fff' : this.props.muiTheme.palette.textColor,
    borderRadius: '20px', 
  }}
/>


             
<Tabs
  onChange={this.handleChange}
  value={this.state.slideIndex}
>
  {columns.map((column, index) => (
    <Tab
      key={index}
      value={index}
      icon={column.icon}
      label={
        <div>
          {column.title} ({(column.title !== 'All') ? column.items.filter(item => item.status === column.title).length : items.length})
        </div>
      }
      style={{
        backgroundColor: this.state.darkMode ? '#8B0000' : '#b36679', 
        color: this.state.darkMode ? '#fff' : '#000', 
      }}
    />
  ))}
</Tabs>
            </div>
            <div className="app-separator">-</div>
            <div className="app-lists">
              <SwipeableViews
                index={this.state.slideIndex}
                onChangeIndex={this.handleChange}
                style={{ width: '100%' }}
              >
                {columns.map((column, index) => (
                  <div className="swipeable-views" key={index}>
                    <Lists
            title="The List"
            items={items}
            updateTask={this.handleUpdateTask}
            removeTask={this.handleRemoveTask}
            removeMode={this.state.removeMode}
          />
                  </div>
                ))}
              </SwipeableViews>
              <CSSTransitionGroup
                transitionName="remove-mode-animation"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
              >
                {this.state.removeMode && (
                  <div className="remove-mode">
                    <RaisedButton
                      label="Delete All Tasks"
                      secondary={true}
                      onClick={this.handleDialogOpen}
                    />
                  </div>
                )}
              </CSSTransitionGroup>
            </div>
          </div>
          <div className="enable-remove-mode">
            <If test={!this.state.removeMode}>
              <FloatingActionButton onClick={this.enableRemoveMode}>
                <EditIcon />
              </FloatingActionButton>
            </If>
            <If test={this.state.removeMode}>
              <FloatingActionButton secondary={true} onClick={this.disableRemoveMode}>
                <CloseIcon />
              </FloatingActionButton>
            </If>
          </div>
        </div>
        <div className="toggle-dark-mode">
  <FloatingActionButton onClick={this.toggleDarkMode} style={{ backgroundColor: '' }}>
    <Brightness4Icon />
  </FloatingActionButton>
</div>
      </div>
    </MuiThemeProvider>
  );
    }
}

App.propTypes = {
  muiTheme: PropTypes.object.isRequired, 
};
export default App;
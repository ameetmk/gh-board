import React from 'react';
import _ from 'underscore';
import { DropTarget } from 'react-dnd';
import BS from 'react-bootstrap';

import Issue from './issue.jsx';


const ItemTypes = {
  CARD: 'card'
};

const cardListTarget = {
  drop: function (props) {
    // TODO: Do something simpler than just props
    return props;
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}


const IssueList = React.createClass({
  displayName: 'IssueList',
  render() {
    const {issues, title, color, repoOwner, repoName} = this.props;
    const {connectDropTarget} = this.props;
    const {isOver} = this.props; // from the collector

    // Sort the issues by `updatedAt`
    const sortedIssues = _.sortBy(issues, (issue) => {
      return issue.updatedAt;
    });
    // Reverse so newest ones are on top
    sortedIssues.reverse();
    const kanbanIssues = _.map(sortedIssues, (issue) => {
      return (
        <Issue
          key={issue.id}
          issue={issue}
          repoOwner={repoOwner}
          repoName={repoName}
        />
      );
    });

    // DnD placeholder element
    const placeholder = (
      <div className="dnd-placeholder"/>
    );

    return connectDropTarget(
      <div className='kanban-issues'>
        <h2 className='title' style={{'background-color': color}}>{title}</h2>
        {isOver && placeholder}
        <BS.ListGroup>
          {kanbanIssues}
        </BS.ListGroup>
      </div>
    );
  }
});

// Export the wrapped version
export default DropTarget(ItemTypes.CARD, cardListTarget, collect)(IssueList);

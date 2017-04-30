import React, { Component } from "react";
import PropTypes from "prop-types";

export function makeSelectableItem(WrappedComponent) {
  return class SelectableItemHOC extends Component {
    static propTypes = {
      onClick: PropTypes.func.isRequired,
      value: PropTypes.any.isRequired
    };

    handleClick = () => {
      this.props.onClick(this.props.value);
    };

    render() {
      const { onClick, ...rest } = this.props;
      return <WrappedComponent onClick={this.handleClick} {...rest} />;
    }
  };
}

export default function makeSelectable(WrappedComponent) {
  return class SelectableHOC extends Component {
    static propTypes = {
      onChange: PropTypes.func.isRequired,
      selected: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.any).isRequired
    };

    handleClick = value => {
      this.props.onChange(value);
    };

    render() {
      const { selected, options: originalOptions, ...rest } = this.props;
      const options = originalOptions.map(option =>
        React.cloneElement(option, {
          onClick: this.handleClick,
          selected: option.props.value === selected
        })
      );
      return <WrappedComponent {...rest} options={options} />;
    }
  };
}

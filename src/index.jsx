import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

export function makeSelectableItem(WrappedComponent) {
  return class SelectableItemHOC extends Component {
    static propTypes = {
      onClick: PropTypes.func.isRequired,
      value: PropTypes.any.isRequired,
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
      options: PropTypes.arrayOf(PropTypes.any).isRequired,
    };

    handleClick = value => {
      this.props.onChange(value);
    };

    render() {
      const { selected, options: originalOptions, ...rest } = this.props;
      const options = originalOptions.map(option =>
        React.cloneElement(option, {
          onClick: this.handleClick,
          selected: option.props.value === selected,
        }),
      );
      return <WrappedComponent {...rest} options={options} />;
    }
  };
}

function bestScrollIntoView(element) {
  if (element.scrollIntoViewIfNeeded !== void 0) {
    element.scrollIntoViewIfNeeded();
  } else if (element.scrollIntoView !== void 0) {
    element.scrollIntoView();
  }
}

function makeScrollIntoView(WrappedComponent, compareOptions) {
  return class SelectedScrollIntoViewHOC extends Component {
    constructor(props) {
      super(props);
      this.selectedOptionElement = null;
    }

    componentDidMount() {
      if (this.selectedOptionElement !== null) {
        bestScrollIntoView(this.selectedOptionElement);
      }
    }

    componentDidUpdate(prevProps) {
      if (
        this.selectedOptionElement !== null &&
        compareOptions(prevProps.options, this.props.options)
      ) {
        bestScrollIntoView(this.selectedOptionElement);
      }
    }

    handleCaptureSelectedOption = option => {
      this.selectedOptionElement = findDOMNode(option);
    };

    render() {
      const { options: originalOptions, ...rest } = this.props;
      const options = originalOptions.map(option => {
        if (option.props.selected) {
          return React.cloneElement(option, {
            ...option.props,
            ref: this.handleCaptureSelectedOption,
          });
        }
        return option;
      });
      return <WrappedComponent {...rest} options={options} />;
    }
  };
}

const defaultCompareOptions = () => true;

export function makeSelectableScrollIntoView(
  WrappedComponent,
  compareOptions = defaultCompareOptions,
) {
  return makeSelectable(makeScrollIntoView(WrappedComponent, compareOptions));
}

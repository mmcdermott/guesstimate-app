import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { createGuesstimateForm, changeGuesstimateForm, saveGuesstimateForm } from 'gModules/guesstimate_form/actions'
import { changeMetricClickMode } from 'gModules/canvas_state/actions'
import $ from 'jquery'
import Icon from 'react-fa'
import DistributionSelector from './distribution-selector.js'
import GuesstimateTypeIcon from './guesstimate-type-icon.js'
import * as guesstimator from 'lib/guesstimator/index.js'
import TextInput from './text-input.js'
import DataViewer from './data-viewer/index.js'
import './style.css'

class GuesstimateForm extends Component{
  displayName: 'GuesstimateForm'

  componentWillMount() {
    this._dispatchChange = _.throttle(this._dispatchChange, 300)
  }

  static propTypes = {
    dispatch: PropTypes.func,
    guesstimateForm: PropTypes.object.isRequired,
    metricId: PropTypes.string.isRequired,
    metricFocus: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    size: PropTypes.string,
    onOpen: PropTypes.func
  }

  static defaultProps = {
     metricFocus: function() { }
  }

  state = {
    showDistributionSelector: false,
    hasChanged: false
  }

  componentWillMount() {
    this.props.dispatch(createGuesstimateForm(this.props.metricId))
  }

  focus() {
    this.refs.TextInput.focus()
  }

  _guesstimateTypeName() {
    return this.props.guesstimateForm.guesstimateType
  }

  _guesstimateType() {
    return guesstimator.find(this._guesstimateTypeName())
  }

  _dispatchChange(params) {
    this.props.dispatch(changeGuesstimateForm(params));
    const {isRangeDistribution} = this._guesstimateType()
    if (this.state.showDistributionSelector && !isRangeDistribution){
      this.setState({showDistributionSelector: false})
    }
  }

  _changeDistributionType(guesstimateType) {
    this._dispatchChange({guesstimateType})
    this.setState({showDistributionSelector: false})
  }

  componentDidUpdate(newProps) {
    const sameMetric = (newProps.guesstimateForm.metric === this.props.guesstimateForm.metric)
    const sameInput = (newProps.guesstimateForm.input === this.props.guesstimateForm.input)
    if (sameMetric && !sameInput){
      this._switchMetricClickMode()
    }
  }

  _changeInput(input) {
    this._dispatchChange({input: input})
    this.setState({hasChanged: true})
  }

  _handleBlur() {
    this._switchMetricClickMode(false)

    if (this.state.hasChanged){
      this.props.dispatch(saveGuesstimateForm());
    }
  }

  _switchMetricClickMode(inClick=true) {
    if (inClick && (this._guesstimateTypeName() === 'FUNCTION')){
      this.props.dispatch(changeMetricClickMode('FUNCTION_INPUT_SELECT'));
    } else {
      this.props.dispatch(changeMetricClickMode(''));
    }
  }

  _addData() {
    this._dispatchChange({guesstimateType: 'DATA', data:[1,2,3], input: null})
    this.props.dispatch(saveGuesstimateForm());
  }

  _deleteData() {
    this._dispatchChange({guesstimateType: null, data:null, input: null})
    this.props.dispatch(saveGuesstimateForm());
  }

  _changeData(data) {
    this._dispatchChange({guesstimateType: 'DATA', data, input: null})
    this.props.dispatch(saveGuesstimateForm());
  }

  _dataViewer() {
    const {guesstimateForm, size} = this.props
    return(
      <DataViewer
        data={guesstimateForm.data}
        onDelete={this._deleteData.bind(this)}
        onSave={this._changeData.bind(this)}
        size={size}
        onOpen={this.props.onOpen}
      />
    )
  }

  _textInput() {
    let {showDistributionSelector} = this.state
    const {guesstimateForm, metricFocus, size} = this.props
    const {input} = guesstimateForm
    const guesstimateType = this._guesstimateType()
    return(
      <div>
        <div className='row'>
          <div className='col-sm-12'>
            <TextInput
              value={input}
              metricFocus={metricFocus}
              onChange={this._changeInput.bind(this)}
              onFocus={() => {this._switchMetricClickMode.bind(this)(true)}}
              onBlur={this._handleBlur.bind(this)}
              onChangeData={this._changeData.bind(this)}
              ref='TextInput'
            />
            <GuesstimateTypeIcon
              guesstimateType={guesstimateType}
              toggleDistributionSelector={() => {this.setState({showDistributionSelector: !showDistributionSelector})}}
            />
          </div>
        </div>
        {showDistributionSelector &&
          <div className='row'>
            <div className='col-sm-12'>
              <DistributionSelector
                onSubmit={this._changeDistributionType.bind(this)}
                selected={guesstimateType}
              />
            </div>
          </div>
        }
      </div>
    )
  }
  //right now errors live in the simulation, which is not present here.
  render() {
    const {size, guesstimateForm} = this.props
    const emptyInput = _.isEmpty(guesstimateForm.input)

    const isLarge = (size === 'large')
    const isSmall = !isLarge
    const hasData = !!guesstimateForm.data

    let formClasses = 'GuesstimateForm'
    formClasses += isLarge ? ' large' : ''

    return(
      <div className={formClasses}>
        {isSmall && hasData && this._dataViewer()}
        {isSmall && !hasData && this._textInput()}

        {isLarge && hasData &&
          <div className='row'>
            <div className='col-sm-12'>
              {this._dataViewer()}
            </div>
          </div>
        }

        {isLarge && !hasData &&
          <div className='row'>
            <div className='col-sm-8'>
              {this._textInput()}
            </div>
            <div className='col-sm-4'>
              {emptyInput &&
                <a className='custom-data' onClick={this._addData.bind(this)}> Add Custom Data </a>
              }
            </div>
          </div>
        }
      </div>)
  }
}

module.exports = connect(null, null, null, {withRef: true})(GuesstimateForm);

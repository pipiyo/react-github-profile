import {Component} from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import * as GitHub from '../../../github-client'

class Query extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
  }
  static contextType = GitHub.Context

  state = {loaded: false, fetching: true, data: null, error: null}

  componentDidMount() {
    this._isMounted = true
    this.query()
  }

  componentDidUpdate(prevProps) {
    if (
      !isEqual(this.props.query, prevProps.query) ||
      !isEqual(this.props.variables, prevProps.variables)
    ) {
      this.setState({fetching: true})
      this.query()
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  query() {
    const client = this.context
    client
      .request(this.props.query, this.props.variables)
      .then(res =>
        this.safeSetState({
          data: res,
          error: null,
          loaded: true,
          fetching: false,
        }),
      )
      .catch(error =>
        this.safeSetState({
          error,
          data: null,
          loaded: false,
          fetching: false,
        }),
      )
  }

  safeSetState(...args) {
    this._isMounted && this.setState(...args)
  }

  render() {
    return this.props.children(this.state)
  }
}

export default Query

import styles from './index.css';
import { Component } from 'react';
import { connect } from 'dva';

class Index extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    const title = "上班情况";
    dispatch({ type: "mainModel/title", payload: { title } });
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.welcome} />
        <ul className={styles.list}>
          <li>To get started, edit <code>src/pages/index.js</code> and save to reload.</li>
          <li>
            <a href="https://umijs.org/guide/getting-started.html">
              Getting Started
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default connect(({ mainModel }) => ({
  mainModel
}))(Index);
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import axios from 'axios';
import Config from '../../Config';
/*tools*/
import BaseUrl from '../../tools/Base';
import errorStatusCode from '../../tools/errorStatusCode';
import print from '../../tools/print';
/*context*/
import ContextDATA from '../../ContextDATA';

class SidenavCMP extends React.Component {
  static contextType = ContextDATA;
  constructor(props) {
    super(props)
    this.state = {
      redirect: '',
      headers: {},
      time: ''
    }
    this.logout = this.logout.bind(this)
  }
  logout(e){
    window.localStorage.removeItem('account')
    this.context.setState({name: 'menu_manage', value:  []})
    this.context.setState({name: 'menu_preferences', value: []})
    this.context.setState({name: 'users', value: {name: 'You are not signed'}})
    this.context.setState({name: 'ui', value: {
      navbar: Config.navbar,
      sidebar: Config.sidebar,
      footer: Config.footer
    }})
    M.toast({html: 'Your account has logout'})
  }
  time(){
    setInterval(() => {
      var date = new Date()
      this.setState({
      	time: date.getFullYear() + '/' + date.getMonth() + 1 + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      })
    }, 1000)
  }
  componentDidMount() {
    var account = window.localStorage.getItem('account')
    if(account){
      var users = JSON.parse(account)
      if(users.data.type == 5 && users.data.role == 'admin'){
        this.setState({
          headers: {
            Authorization: users.token
          }
        })
      }else{
        this.setState({
          headers: {
            Authorization: users.token
          }
        })
      }
    }
    document.querySelector('#toTop').onclick = (e) => window.scrollTo(0,0)
    window.addEventListener('scroll', e => {
      if(window.scrollY > 1000){
        document.querySelector('#toTop').classList.remove('hide')
      }else{
        document.querySelector('#toTop').classList.add('hide')
      }
    })
    tinymce.init({
      selector: 'textarea[name="add_content"]',
      setup: function (editor) {
      editor.on('init', function (e) {
        editor.setContent('<p>Type Here...</p>');
      });
    }
    });
    $('.sidenav').sidenav();
    $('#slide-in').sidenav({edge:'right'});
    $('#slide-in').sidenav('close');
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip();
    $('#modal-upload-file').modal();
    $('#modal-add-article').modal();
    this.time()
  }
  render() {
    if(this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <React.Fragment>
        <a id="toTop" className="btn-floating btn-large waves-effect waves-light red hide tooltipped" data-position="right" data-tooltip="Back To Top">
        	<i className="material-icons">north</i>
        </a>
        <ContextDATA.Consumer>
        {
          result => (
            <React.Fragment>
            <div id="slide-in" className="sidenav">
              {
                result.notification.length === 0 ? <p className="black-text center-align">No Notification</p>:
                <React.Fragment>
                <ul className="collection" style={{border:'none !important'}}>
                {
                  result.notification.map((data, key) => {
                    return(
                      <React.Fragment key={key}>
                      {
                        data.type == 'subscribe' ?
                          <li className={data.status == 'unread' ? 'collection-item avatar pointer': 'collection-item avatar pointer active'}>
                            <i className="material-icons circle red">subscriptions</i>
                            <span className={data.status == 'unread' ? 'title black-text': 'title white-text'}>Subscriptions</span>
                            <p className={data.status == 'unread' ? 'black-text': 'white-text'}>{data.message}</p>
                          </li>
                          :false
                      }
                      {
                        data.type == 'unsubscribe' ?
                          <li className={data.status == 'unread' ? 'collection-item avatar pointer': 'collection-item avatar pointer active'}>
                            <i className="material-icons circle red">unsubscribe</i>
                            <span className={data.status == 'unread' ? 'title black-text': 'title white-text'}>Unsubscribe</span>
                            <p className={data.status == 'unread' ? 'black-text': 'white-text'}>{data.message}</p>
                          </li>
                          :false
                      }
                      </React.Fragment>
                    )
                  })
                }
                </ul>
                <a className="btn waves-effect waves-light blue w-100">
                  Read All
                </a>
                <a className="btn waves-effect waves-light red w-100">
                  Clear All
                </a>
                </React.Fragment>
              }
            </div>
            <ul id="slide-out" className={result.ui.sidebar.bg ? "sidenav sidenav-fixed " + result.ui.sidebar.bg: "sidenav sidenav-fixed"}>
              <li>
                <div className="user-view">
                  <div className="background">
                    <img src={result.ui.sidebar.cover}/>
                  </div>
                  <Link to={'/profile/' + result.users.id}>
                    <img className="circle" src={result.users.avatar ? `${BaseUrl}api/usrfile/${result.users.id}/${result.users.avatar}`: Config.users.avatarDefault}/>
                  </Link>
                  <Link to={'/profile/' + result.users.id}>
                    <span className="white-text name">{result.users.name}</span>
                  </Link>
                  <Link to={'/profile/' + result.users.id}>
                    <span className="white-text email">{result.users.email}</span>
                  </Link>
                </div>
              </li>
              <li>
                <Link className={result.ui.sidebar.txt ? "waves-effect waves-dark " + result.ui.sidebar.txt: "waves-effect waves-dark"} to="/">
                  <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>home</i>Home
                </Link>
              </li>
              <li className="no-padding">
                <ul className="collapsible collapsible-accordion">
                  <li>
                    <a className={result.ui.sidebar.txt ? "collapsible-header sidebar-collapse " + result.ui.sidebar.txt: "collapsible-header sidebar-collapse"}>Category
                      <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>layers</i>
                    </a>
                    <div className="collapsible-body">
                      <ul>
                      {
                        result.category.map((data, key) => {
                          return(
                            <li key={key}><Link to={"/category/" + data.name}>{data.name}</Link></li>
                          )
                        })
                      }
                      </ul>
                    </div>
                  </li>
                </ul>
              </li>
              {
                result.menu_manage.length >= 1 ?
                <React.Fragment>
                <li>
                  <Link className={result.ui.sidebar.txt ? "waves-effect waves-dark " + result.ui.sidebar.txt: "waves-effect waves-dark"} to="/dashboard">
                    <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>insert_chart</i>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className={result.ui.sidebar.txt ? "waves-effect waves-dark " + result.ui.sidebar.txt: "waves-effect waves-dark"} to="/my-favorite">
                    <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>favorite</i>
                    My Favorite
                  </Link>
                </li>
                <li>
                  <Link className={result.ui.sidebar.txt ? "waves-effect waves-dark " + result.ui.sidebar.txt: "waves-effect waves-dark"} to="/my-subscribe">
                    <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>subscriptions</i>
                    My Subscribe
                  </Link>
                </li>
                <li>
                  <div className="divider"></div>
                </li>
                <li>
                  <a className={result.ui.sidebar.txt ? "subheader " + result.ui.sidebar.txt: "subheader"}>Management</a>
                </li>
                {
                  result.menu_manage.map((text, key) => {
                  return(
                    <li key={key}>
                      <Link className={result.ui.sidebar.txt ? "waves-effect waves-dark " + result.ui.sidebar.txt: "waves-effect waves-dark"} to={'/management/' + text.toLowerCase()}>
                        <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>folder</i>
                        {text}
                      </Link>
                    </li>
                  )
                })
                }
                </React.Fragment>
                : ''
              }
              {
                result.menu_preferences.length >= 1 ?
                <React.Fragment>
                <li><div className="divider"></div></li>
                <li><a className={result.ui.sidebar.txt ? "subheader " + result.ui.sidebar.txt: "subheader"}>Setting</a></li>
                {
                  result.menu_preferences.map((text, key) => {
                  return(
                    <li key={key}>
                      <Link className={result.ui.sidebar.txt ? "waves-effect waves-dark " + result.ui.sidebar.txt: "waves-effect waves-dark"} to={text.url}>
                        <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>{text.icon}</i>
                        {text.txt}
                      </Link>
                    </li>
                  )
                  })
                }
                {
                  result.menu_manage.length >= 1 ?
                    <li onClick={this.logout}>
                      <a style={{cursor: 'pointer'}}>
                        <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>arrow_back</i>
                        <span className={result.ui.sidebar.txt ? result.ui.sidebar.txt: ''}>Logout</span>
                      </a>
                    </li>: ''
                }
                </React.Fragment>
                : ''
              }
              {
                result.menu_manage.length >= 1 ?
                ''
                :
                <React.Fragment>
                  <li>
                    <div className="divider"></div>
                  </li>
                  <li>
                    <a className={result.ui.sidebar.txt ? "subheader " + result.ui.sidebar.txt: "subheader"}>Auth</a>
                  </li>
                  <li>
                    <Link className={result.ui.sidebar.txt ? "waves-effect waves-dark " + result.ui.sidebar.txt: "waves-effect waves-dark"} to="/login">
                    <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>login</i>
                    Login</Link>
                  </li>
                  <li>
                    <Link className={result.ui.sidebar.txt ? "waves-effect waves-dark " + result.ui.sidebar.txt: "waves-effect waves-dark"} to="/register">
                    <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>text_snippet</i>
                    Register</Link>
                  </li>
                </React.Fragment>
              }
              <li><div className="divider"></div></li>
              <li><a className={result.ui.sidebar.txt ? "subheader " + result.ui.sidebar.txt: "subheader"}>More</a></li>
              <li>
                <Link className={result.ui.sidebar.txt ? "waves-effect waves-dark " + result.ui.sidebar.txt: "waves-effect waves-dark"} to="/premium">
                <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>shop</i>
                Buy Premium</Link>
              </li>
              <li>
                <Link to="/" className="black-text waves-effect waves-dark">
                  <i className={result.ui.sidebar.txt ? "material-icons " + result.ui.sidebar.txt: "material-icons"}>today</i>
                  <span className={result.ui.sidebar.txt ? result.ui.sidebar.txt: ''}>{this.state.time}</span>
                </Link>
              </li>
            </ul>
            </React.Fragment>
          )
        }
        </ContextDATA.Consumer>
      </React.Fragment>
    )
  }
}
export default SidenavCMP;
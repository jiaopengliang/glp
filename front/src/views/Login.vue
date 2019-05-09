<template>
  <div class="login">
    <div class="background">
      <canvas id="homeCanvas"></canvas>
    </div>
    <div class="login-content">
      <!-- <img src="/static/_kimg/searchprotal/search-logo.png" alt="logo"> -->
      <div class="form-item" :class="{'error-input':errorText}">
        <span>用户名</span>
        <input type="text" name="" placeholder="USERNAME" v-model="form.account" @focus="clearErrorTip" @blur='formChanged'>
      </div>
      <div class="form-item" :class="{'error-input':errorText}">
        <span style="padding-right:14px;">密码</span>
        <input type="password" name="" placeholder="PASSWORD" v-model="form.password" @keydown.enter="submit" @focus="clearErrorTip" @blur='formChanged'>
      </div>
      <div class="form-box clearfix">
        <div class="remeber-pass fl">
          <input type="checkbox" name="" value="" v-model="remember">
          <span class="check-box" :class="{'active':remember}"></span>
          <span>记住密码</span>
        </div>
        <!-- <div class="forget-pass fr"> 忘记密码？ </div> -->
      </div>
      <div class="error-tip">
        <span>{{errorText}}</span>
      </div>
      <div class="form-item form-item-login">
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="submit">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import network from "@/libs/network";
import { setToken, setItem } from "@/libs/storage";
import md5 from 'js-md5';


export default {
  data() {
    return {
      form: {},
      errorText: '',
      remember: true,
      isDemoUser: false,
      loading: false,
    };
  },
  methods: {
    submit() {
      var params = this.form;
      if (params.account == "" && params.password == "")
        return this.errorText = '请输入用户名和密码';
      else if (params.account == "")
        return this.errorText = '请输入用户名';
      else if (params.password == "")
        return this.errorText = '请输入密码';

      this.loading = true;
      this.clearErrorTip();

      // serviceFactory.loginService('login', {
      //   account: params.account,
      //   password: md5(params.password)
      // }, (data) => {
      //   sessionFactory.resetSession(data);
      //   this.loading = false;
      //   this.clearErrorTip();

      //   nsRoute.jumpTo('/');
      // }, (resData) => {
      //   this.loading = false;
      //   this.errorText = resData.msg;
      // });
      network
        .post("/api/login/doLogin", {
          account: params.account,
          // password: md5(params.password)
          password: params.password
        })
        .then(res => {
          if (res.data) {
            this.loading = false;
            this.clearErrorTip();
            if (res.data.code == 200) {
              setToken(res.data.token)
              setItem("admin", {
                name: params.account
              })
              // setItem("glpApi", {
              //   isReferenced: false
              // })
              this.$router.push("/home");
            } else {
              return this.errorText = '请确认账号或密码是否正确';
            }
          }
        });
    },
    formChanged() {
      this.clearErrorTip();
      this.updateSaved(this.remember);
    },
    loadSaved() {
      if (window.localStorage.getItem('loginRemember') == 'true') {
        this.form.account = window.localStorage.getItem('loginName');
        this.form.password = window.localStorage.getItem("loginPass");
        this.remember = window.localStorage.getItem("loginRemember");
      } else {
        this.form.account = '';
        this.form.password = '';
        this.remember = '';
      }
    },
    updateSaved(ifSaved) {
      if (ifSaved) {
        window.localStorage.setItem('loginName', this.form.account);
        window.localStorage.setItem('loginPass', this.form.password);
        window.localStorage.setItem('loginRemember', 'true')
      } else {
        window.localStorage.setItem('loginName', '');
        window.localStorage.setItem('loginPass', '');
        window.localStorage.setItem('loginRemember', 'false')
      }
    },
    clearErrorTip() { this.errorText = ''; }
  },
  name: "login",
  components: {
  },
  watch: {
    remember(cur, old) { this.updateSaved(cur); }
  },
  mounted: function() {
    // 记住密码
    this.loadSaved();

    //测试
    // var query = this.$route.query;
    // if (query.ticket) {
    //   let ticket = query.ticket;
    //   let appid = 'GLP9be0b9301a02c211'
    //   network.get('/api/login/getToken?ticket=' + ticket + '&appid=' + appid).then(res => {
    //     if (res.data.code == 200) {
    //       setToken(res.data.token);
    //       setItem("glpApi", {
    //         isReferenced: true
    //       })
    //       this.$router.push("/home");
    //     }
    //   })
    // }
  }
};
</script>


<style>
* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  /* Firefox */
  -webkit-box-sizing: border-box;
  /* Safari */
}

.clearfix:after {
  display: block;
  content: "";
  height: 0;
  overflow: hidden;
  clear: both;
  visibility: hidden;
}

a {
  text-decoration: none;
}

.login {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("../assets/images/glp/login_bg.png") no-repeat center;
  background-size: cover;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
}

.login-content {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 492px;
  height: 278px;
  margin: -136px 0 0 -240px;
  padding: 0px;
}

.login .login-content .form-item {
  width: 492px;
  height: 46px;
  margin-top: 18px;
  line-height: 46px;
  font-size: 14px;
  color: #fff;
  background: rgba(22, 22, 22, 0.34);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.login .login-content .form-box {
  color: #fff;
  font-size: 14px;
  padding-top: 18px;
}

.login .login-content .form-box .remeber-pass input {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  width: 18px;
  height: 18px;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.login .login-content .form-item input {
  width: 426px;
  height: 45px;
  margin-left: 2px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 16px;
  padding-left: 10px;
}

.login .login-content .form-box .remeber-pass {
  position: relative;
  text-align: left;
}

.login .login-content .form-box .remeber-pass .check-box {
  position: relative;
  top: -1px;
  display: inline-block;
  width: 14px;
  height: 14px;
  background: red;
  vertical-align: middle;
  margin-right: 5px;
  background: url(../assets/images/glp/remember-check.png) no-repeat center;
}

.login .login-content .form-box .remeber-pass .check-box.active {
  background: url(../assets/images/glp/remember-checked.png) no-repeat center;
}

.login .login-content .form-box .remeber-pass input {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  width: 18px;
  height: 18px;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.login .login-content .form-item.form-item-login {
  margin-top: 0px;
  border-radius: 3px;
}

input {

  border: 0;
  outline: none;
  background-color: rgba(0, 0, 0, 0);
}

.login .login-content .form-item button {
  width: 100%;
  height: 46px;
  background-image: -webkit-linear-gradient(top, #ffbe25, #fd8f09);
  font-size: 18px;
  color: #fff;
  text-align: center;
  border-radius: 3px;
  border-color: transparent;
}

.login img {
  position: absolute;
  top: -132px;
  left: 62px;
}

.error-tip {
  height: 24px;
  line-height: 24px;
  color: #ff5454;
  font-size: 12px;
  padding-left: 8px;
  text-align: left;
}
</style>

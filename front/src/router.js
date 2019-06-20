import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Stop from './views/Stop.vue';
import Detail from './views/Detail.vue';
import network from "@/libs/network";
import {
  getToken,
  setToken
} from './libs/storage';

Vue.use(Router);

let router = new Router({
  routes: [{
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        title: '普洛斯图谱系统-首页',
        requiresAuth: true,
        iframeEnabled: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '普洛斯图谱系统-登录'
      }
    },
    {
      path: '/stop',
      name: 'stop',
      component: Stop
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail,
      meta: {
        title: '普洛斯图谱系统-公司详情'
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.query.ticket) {
    let ticket = to.query.ticket;
    network.get('/api/login/getToken?ticket=' + ticket).then(res => {
      if (res.data.code == 200) {
        setToken(res.data.token);
      }
    })
    if (to.matched.some(path => path.meta.requiresAuth)) {
      var token = getToken();
      if (to.meta.iframeEnabled && token) {
        if (token != token) {
          setToken(token);
          token = token;
        }
      }
      if (!ticket) {
        debugger
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        });
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    if (to.matched.some(path => path.meta.requiresAuth)) {
      var token = getToken();
      if (to.meta.iframeEnabled && token) {
        if (token != token) {
          setToken(token);
          token = token;
        }
      }
      if (!token) {
        debugger
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        });
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

export default router;